const express = require("express");
const {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  // createManySubscriptions,
  updateSubscription,
  deleteSubscription,
} = require("../controllers/subscription");
const api = express.Router();
api.route("/").get(getAllSubscriptions).post(createSubscription);
api
  .route("/:id")
  .get(getSubscriptionById)
  .put(updateSubscription)
  .delete(deleteSubscription);
module.exports = api;
