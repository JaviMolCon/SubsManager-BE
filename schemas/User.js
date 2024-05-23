const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  profilePic: { type: String, score: 25 },
  firstName: { type: String, score: 25 },
  lastName: { type: String, score: 25 },
  country: { type: String, score: 25 },
  sharedSubscriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
  ],
  subscriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);

//! Create a new user obj in order to not send the user's pass
// const getUser = async (req, res) => {
//     try {
//         const user = User.findById()
//          .populate('sharedSubscriptions')
//          .populate('subscriptions')
//         const newUser = {user.firstName, user.lastName,}
//         res.json(newUser)
//     } catch () {

//     }
// }
