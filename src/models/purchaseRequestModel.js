const { default: mongoose } = require("mongoose");
const { FILE_URL } = require("../shared/const");

const purchaseRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    file: {
      type: mongoose.Types.ObjectId,
      ref: "File",
      required: [true, "File is required"],
    },
    purchase: {
      type: mongoose.Types.ObjectId,
      ref: "Purchase",
    },
    status: {
        type: String,
        required: [true, "Status is required"],
        enum: ["new","duplicate","active"],
        default: "new",
      },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const PurchaseRequest = mongoose.model(
  "PurchaseRequest",
  purchaseRequestSchema
);
module.exports = PurchaseRequest;
