const { model } = require("mongoose");

const { PositionsSchema } = require("../schema/PositionsSchema");

const PositionsModel = model("position", PositionsSchema)

module.exports = {PositionsModel}