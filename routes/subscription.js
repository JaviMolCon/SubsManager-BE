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

api.get("/", (req, res, next) => {
  const { category } = req.query;

  if (category) {
    // If category is provided, invoke findSubsCategory middleware
    return findSubsCategory(req, res);
  } else {
    // If category is not provided, invoke getAllSubscriptions middleware
    return getAllSubscriptions(req, res);
  }
});

api.use(requireAuth);

// Define route handlers for POST requests to '/'
api.post("/", createSubscription);
api
  .route("/:id")
  .get(getSubscriptionById)
  .put(updateSubscription)
  .delete(deleteSubscription);
module.exports = api;
