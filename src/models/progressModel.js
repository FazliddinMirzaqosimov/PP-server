const { default: mongoose, Mongoose } = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: [true, "Course section id is required"],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User id is required"],
      },
    videoOrder: {
      type: Number,
      required: [true, "Order is required"],
    
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const Progress = mongoose.model("Progress", progressSchema);
module.exports = Progress;
