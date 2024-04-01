const { default: mongoose, Mongoose } = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: [true, "Link is required"],
    },
    type: {
      type: String,
      default: "youtube",
      enum: ["vimeo", "youtube"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: [true, "Course section id is required"],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course section id is required"],
    },
    order: {
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
 
const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
