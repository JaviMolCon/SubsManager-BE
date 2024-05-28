const User = require("../schemas/User");
const Subscription = require("../schemas/Subscription");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //   console.log(req.body);
  try {
    const user = await User.login(email, password);

    // create token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
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
    const token = createToken(user._id);

    res.status(200).json({ email, token });
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
    const { id } = req.params;
    const user = await User.findById(id)
      .select("-password")
      .populate("sharedSubscriptions")
      .populate("subscriptions");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Filtering User
const getUserSubs = async (req, res) => {
  try {
  } catch (error) {}
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

module.exports = {
  loginUser,
  signUpUser,
  getAllUsers,
  getUser,
  updateUser,
  addSub,
  deleteUser,
};
