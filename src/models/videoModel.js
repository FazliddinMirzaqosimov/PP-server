const { default: mongoose, Mongoose } = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: [true, "Video is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
    },
    courseSectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseSection",
      required: [true, "Course section id is required"],
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
