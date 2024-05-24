const express = require("express");
const {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  // createManySubscriptions,
  updateSubscription,
  deleteSubscription,
  getSubscriptionAndUpdateById,
} = require("../controllers/subscriptionController");
const requireAuth = require("../middlewares/requireAuth");
const api = express.Router();

api.use(requireAuth);
api
  .route("/")
  .get(getAllSubscriptions)
  .post(createSubscription)
  .put(getSubscriptionAndUpdateById);
api
  .route("/:id")
  .get(getSubscriptionById)
  .put(updateSubscription)
  .delete(deleteSubscription);
module.exports = api;
