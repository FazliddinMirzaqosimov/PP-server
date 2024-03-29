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
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
    chat: {
      type: String,
    },
    teacherName: {
      type: String,
    },
    priority: {
      type: Number,
      default: 10,
    },
    status: {
      type: Number,
      default: 1,
      enum: [1, 0],
    },
    type: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    userId: {
      required: [true, "User is required"],
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    trailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
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
