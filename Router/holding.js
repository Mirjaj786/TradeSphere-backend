const express = require("express");
const Router = express.Router();

const HoldingModel = require("../model/HoldingModel.js");
const router = require("./user");

// Holdings
Router.get("/allholdings", async (req, res, next) => {
  try {
    const holdings = await HoldingModel.find({});
    const total = await HoldingModel.countDocuments();
    res.json({ total, holdings });
  } catch (error) {
    next(error);
  }
});

module.exports = router;