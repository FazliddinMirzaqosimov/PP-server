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

    image: {
      type: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    },
    price: {
      required: [true, "Price is required"],
      type: Number,
    },
    duration: {
      required: [true, "Duration is required"],
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
