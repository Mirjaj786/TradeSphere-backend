const { Schema } = require("mongoose");

const HoldingSchema = new Schema({
  name: { type: String, required: true },
  qty: { type: Number, default: 0 },
  avg: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  net: { type: String, default: "0" },
  day: { type: String, default: "" },
});

module.exports = { HoldingSchema };
