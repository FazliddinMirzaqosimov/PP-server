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
  },
  {
    timestamps: { createdAt: "createdAt" },
  }
);

const Purchase = mongoose.model("Purchase", prurchaseSchema);
module.exports = Purchase;
