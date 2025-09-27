const { model } = require("mongoose");
const { HoldingSchema } = require("../schema/HoldingSchema.js");

const HoldingModel = model("holding", HoldingSchema);

module.exports = { HoldingModel };
