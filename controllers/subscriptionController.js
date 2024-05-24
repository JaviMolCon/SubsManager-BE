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

// Function to create a new subscription
const createSubscription = async (req, res) => {
  try {
    const { owner, category, platformName, plan, members, expirationDate } =
      req.body; // Destructuring the request body to get subscription details

    // creating a new subscription instance with the provided data
    const subscription = await Subscription.create({
      owner,
      category,
      platformName,
      plan,
      members,
      expirationDate,
    });
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

// update a subscription by ID
const updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("owner")
      .populate("members");

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
  // createManySubscriptions,
};
