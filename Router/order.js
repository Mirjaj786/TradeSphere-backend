const express = require("express");
const Router = express.Router();

const { OrderModel } = require("../model/Orders.js");

Router.post("/newOrder", async (req, res, next) => {
  try {
    const { name, qty, price, mode } = req.body;
    if (!name || !qty || !price || !mode) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const newOrder = new OrderModel({ name, qty, price, mode });
    await newOrder.save();

    res.status(201).json({ message: "Order saved", order: newOrder });
  } catch (err) {
    next(err);
  }
});

Router.get("/", async (req, res, next) => {
  try {
    const orders = await OrderModel.find({});
    const total = await OrderModel.countDocuments();
    res.json({ total, orders });
  } catch (error) {
    next(error);
  }
});

module.exports = Router;
