const { model } = require("mongoose");
const { OrdersSchema } = require("../schema/OrdersSchema");

const OrderModel =  model("order", OrdersSchema);

module.exports = { OrderModel };
