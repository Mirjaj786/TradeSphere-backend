const express = require("express");
const Router = express.Router();

const { OrderModel } = require("../model/Orders.js");

Router.post("/newOrder", async (req, res, next) => {
  try {
    const { name, qty, price, mode } = req.body;
    if (!name || !qty || !price || !mode) {
      return res.status(401).json({ message: "please field all " });
    }

    const newOrder = new OrderModel({ name, qty, price, mode });
    await newOrder.save();

    res.status(201).json({ message: "Order saved", order: newOrder });
  } catch (err) {
    next(err);
  }
});

Router.get("/orders", async (req, res, next) => {
  try {
    const orders = await OrderModel.find({});
    const total = await OrderModel.countDocuments();
    res.json({ total, orders });
  } catch (error) {
    next(error);
  }
});

module.exports = Router;
