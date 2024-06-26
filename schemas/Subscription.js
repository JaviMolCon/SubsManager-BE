const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: { type: String, required: true },
  platformName: { type: String, required: true },
  plan: {
    planName: { type: String, required: true },
    price: { type: Number, required: true },
    maxMembers: { type: Number, required: true },
  },
  public: { type: Boolean, required: true },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  expirationDate: { type: Date, required: true },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);

//* PUT REQ => ...prev, newValue
//!Needs to use populate() on controller
//!populate() is only needed when using the .get()
//! E.g: we need to retrieve all the subs that match a certain criteria. In that case the controller would need to populate the members field.
