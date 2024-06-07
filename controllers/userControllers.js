const User = require("../schemas/User");
const Subscription = require("../schemas/Subscription");
const jwt = require("jsonwebtoken");

const createToken = (_id, username, profilePic, email) => {
  return jwt.sign({ _id, username, profilePic, email }, process.env.SECRET, {
    expiresIn: "1d",
  });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //   console.log(req.body);
  try {
    const user = await User.login(email, password);

    // create token
    const token = createToken(
      user._id,
      user.username,
      user.profilePic.url,
      user.email
    );

    res.status(200).json({
      email,
      token,
      userId: user._id,
      profilePic: user.profilePic.url,
    });
    console.log(user.profilePic);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log("sss");
  }
};

// sign up user
const signUpUser = async (req, res) => {
  const { email, password, username } = req.body;
  //   console.log(req.body);
  try {
    const user = await User.signup(email, password, username);

    // create token
    const token = createToken(user._id, user.username);

    res.status(200).json({ email, token, userId: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get ALl Users
const getAllUsers = async (req, res) => {
  try {
    const user = await User.find()
      .populate("subscriptions")
      .populate("sharedSubscriptions");
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get one User
const getUser = async (req, res) => {
  try {
    console.log("gettingTheUser");
    const { id } = req.params;
    const user = await User.findById(id)
      .select("-password")
      .populate("sharedSubscriptions")
      .populate("subscriptions");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserSubs = async (req, res) => {
  const { platformName } = req.query;

  if (!platformName) {
    return res
      .status(400)
      .json({ message: "platformName query parameter is required" });
  }

  try {
    // Step 1: Find the Subscription documents that match the platformName (case-insensitive)
    const subscriptions = await Subscription.find({
      platformName: { $regex: platformName, $options: "i" },
    });

    if (subscriptions.length === 0) {
      return res.status(404).json({
        message: "No subscriptions found with the specified platform name",
      });
    }

    // Extract the subscription IDs
    const subscriptionIds = subscriptions.map((sub) => sub._id);

    // Step 2: Find the User documents that reference these Subscription documents in their sharedSubscriptions array
    const users = await User.find({
      sharedSubscriptions: { $in: subscriptionIds },
    })
      .select("-password")
      .populate({
        path: "sharedSubscriptions",
        match: {
          platformName: { $regex: platformName, $options: "i" },
        }, // Only populate matching subscriptions
      });

    if (users.length === 0) {
      return res.status(404).json({
        message:
          "No users found with the specified platform name in shared subscriptions",
      });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(
      "Error finding users with shared subscription platform:",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

//Edit one User
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .populate("sharedSubscriptions")
      .populate("subscriptions");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log("sss");
  }
};

const addSub = async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve the user first
    const user = await User.findById(id)
      .populate("sharedSubscriptions")
      .populate("subscriptions");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure req.body.subscriptions is an array
    if (!Array.isArray(req.body.subscriptions)) {
      return res
        .status(400)
        .json({ error: "Subscriptions should be an array" });
    }

    // Add new subscriptions to the array
    user.subscriptions.push(...req.body.subscriptions);

    // Save the updated user document
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Delete user

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    res.status(200).json("Deleted Successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//upload image

const uploadImage = async (req, res) => {
  try {
    // Check if the request contains a file
    if (req.file && req.file.path) {
      // Find the user by ID
      const userId = req.params.id; // Assuming you're passing the userId in the URL
      const user = await User.findById(userId);

      // If user not found, return an error
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update the profilePic field of the user
      user.profilePic = {
        url: req.file.path,
        description: req.body.desc,
      };

      // Save the updated user
      await user.save();

      return res
        .status(200)
        .json({ msg: "Profile picture successfully updated" });
    } else {
      // If no file is provided, return an error
      return res.status(422).json({ error: "No image provided" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  uploadImage,
  loginUser,
  signUpUser,
  getAllUsers,
  getUser,
  updateUser,
  addSub,
  deleteUser,
  getUserSubs,
  uploadImage,
};
