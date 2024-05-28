const express = require("express");
const { postMessage } = require("../controllers/contactController");

const app = express.Router();

app.post("/", postMessage);

module.exports = app;
