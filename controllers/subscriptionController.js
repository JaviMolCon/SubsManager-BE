const Subscription = require("../schemas/Subscription");
const User = require("../schemas/User");

// get all subscriptions with populated members
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("owner")
      .populate("members");
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//to fetch a subscription and populate the owner and members fields with the actual user documents
// get a single subscription by ID
const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate("owner")
      .populate("members");
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const getSubscriptionAndUpdateById = async (req, res) => {
//   try {
//     // Fetch the subscription
//     const subscription = await Subscription.findById(req.params.id)
//       .populate("owner")
//       .populate("members");

//     // If subscription not found, return 404
//     if (!subscription) {
//       return res.status(404).json({ message: "Subscription not found" });
//     }

//     // Update the subscription by adding the user to members
//     const updatedSubscription = await Subscription.findByIdAndUpdate(
//       req.params.id,
//       {
//         $addToSet: { members: req.user._id },
//       },
//       { new: true }
//     )
//       .populate("owner")
//       .populate("members");

//     // Send the updated subscription as response
//     res.status(200).json(updatedSubscription);
//   } catch (error) {
//     // Handle different types of errors
//     if (error.name === "CastError") {
//       return res.status(400).json({ message: "Invalid subscription ID" });
//     }
//     res.status(500).json({ message: error.message });
//   }
// };

// Function to create a new subscription
const createSubscription = async (req, res) => {
  try {
    const { category, platformName, plan, members, expirationDate, public } =
      req.body; // Destructuring the request body to get subscription details

    // creating a new subscription instance with the provided data
    const subscription = await Subscription.create({
      owner: req.user._id,
      category,
      platformName,
      plan,
      members,
      expirationDate,
      public,
    });

    if (public) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { sharedSubscriptions: subscription._id },
      });
    }
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { subscriptions: subscription._id },
    });
    subscription.members.push(req.user._id);
    await subscription.save();
    res.status(201).json(subscription); // Sending a successful response
  } catch (error) {
    res.status(500).json({ message: "Error creating subscription", error }); // Sending an error response if something goes wrong
  }
};
// function to create subscriptions
// const createManySubscriptions = async (req, res) => {
//   try {
//     const subscription = await Subscription.create(req.body);
//     res.status(201).json(subscription);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

//Update Sub
const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id)
      .populate("members")
      .populate("owner");

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (!Array.isArray(req.body.members)) {
      return res.status(400).json({ error: "Members should be an array" });
    }

    if (subscription.members.length === subscription.plan.maxMembers) {
      throw new Error("Max members");
    } else {
      // Add new members to the subscription's members array
      subscription.members.push(...req.body.members);
    }

    // Save the updated subscription
    console.log(subscription.members.length);
    await subscription.save();

    // Update the subscriptions array in each member
    for (const memberId of req.body.members) {
      const user = await User.findById(memberId);

      if (user) {
        // Add the subscription to the user's subscriptions if not already present
        if (!user.subscriptions.includes(subscription._id)) {
          user.subscriptions.push(subscription._id);
          await user.save();
        }
      }
    }

    res.status(200).json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Find Subscription by category
const findSubsCategory = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res
        .status(400)
        .json({ message: "category query parameter is required" });
    }
    const subCategory = await Subscription.find({ category: name });
    res.status(200).json(subCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a subscription by ID
const deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  findSubsCategory,
  // createManySubscriptions,
  // getSubscriptionAndUpdateById,
};
