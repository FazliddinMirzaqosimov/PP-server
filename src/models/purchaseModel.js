const { default: mongoose } = require("mongoose");

const prurchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      validate: {
        validator: (value) => value >= 0,
        message: "Amount must be positive",
      },
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: [true, "Plan is required"],
    },
  },
  {
    timestamps: { createdAt: "createdAt",updatedAt: "updatedAt" },
  }
);

const Purchase = mongoose.model("Purchase", prurchaseSchema);
module.exports = Purchase;
