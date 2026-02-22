const { Schema, model } = require("mongoose");

const levelSchema = new Schema({
  userID: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
});

module.exports = model("Level", levelSchema);