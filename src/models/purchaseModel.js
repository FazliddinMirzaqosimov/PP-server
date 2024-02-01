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
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: [
        function () {
          return this.amount < 0;
        },
        "planId is required if amount is less then  0 ",
      ],
    },
    planDuration: {
      type: Number,
      required: [
        function () {
          return this.amount < 0;
        },
        "playDuration is required if amount is less then  0 ",
      ],
    },
    planTitle: {
      type: String,
      required: [
        function () {
          return this.amount < 0;
        },
        "planTitle is required if amount is less then  0 ",
      ],
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

const Purchase = mongoose.model("Purchase", prurchaseSchema);
module.exports = Purchase;
