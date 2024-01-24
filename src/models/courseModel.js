const { default: mongoose } = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
    },
    chat: {
      type: String,
      required: [true, "Chat is required"],
    },
    image: {
      type: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    },
    userId: {
      required: [true, "User id is required"],
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
