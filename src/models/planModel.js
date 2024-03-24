const { default: mongoose } = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
    },
    advantages: {
      type: [String],
      default: [],
    },
    color:{
      type: String,
      default:"#ebc870"

    },
    price: {
      required: [true, "Price is required"],
      type: Number,
    },
    duration: {
      required: [true, "Duration is required"],
      type: Number,
    },
    order: {
      type: Number,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan;
