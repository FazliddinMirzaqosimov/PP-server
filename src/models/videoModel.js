const { default: mongoose, Mongoose } = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      // required: [true, "Video is required"],
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
      required: [true, "Duration is required"],
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: [true, "Course section id is required"],
    },
    order: {
      type: Number,
      unique: true,
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
