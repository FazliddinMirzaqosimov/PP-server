const { default: mongoose } = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: [true, "video is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
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
