const express = require("express");
const {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  findSubsCategory,
} = require("../controllers/subscriptionController");
const requireAuth = require("../middlewares/requireAuth");
const api = express.Router();

api.use(requireAuth);
api
  .route("/")
  .get(findSubsCategory, getAllSubscriptions)
  .post(createSubscription);
// .get(findSubsCategory);

// api.route("/").get(findSubsCategory);
api
  .route("/:id")
  .get(getSubscriptionById)
  .put(updateSubscription)
  .delete(deleteSubscription);
module.exports = api;
