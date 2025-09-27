const express = require("express");
const Router = express.Router();

const PositionsModel = require("../model/PositionsModel.js");


Router.get("/allpositions", async (req, res, next) => {
  try {
    const positions = await PositionsModel.find({});
    res.json({ positions });
  } catch (error) {
    next(error);
  }
});


module.exports = Router;