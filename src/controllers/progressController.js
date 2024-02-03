const { sendError, sendSucces } = require("../utils/senData");
const Progress = require("../models/progressModel");
const Video = require("../models/videoModel");

class ProgressControllers {
  // Get progress of section
  static get = async (req, res) => {
    try {
      const userId = req.user._id;
      const sectionId = req.query.sectionId;
      const progress = await Progress.findOne({ userId, sectionId });

      sendSucces(res, {
        status: 200,
        data: { progress: progress?.videoOrder || 1 },
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // next button clicked after watched video in order to watch next video
  static nextVideo = async (req, res) => {
    try {
      const userId = req.user._id;
      const sectionId = req.query.sectionId;
      let progress = await Progress.findOne({
        userId,
        sectionId,
      });

      const lastVideo = await Video.findOne({
        sectionId,
      }).sort({ order: -1 });

      if (!progress) {
        progress = await Progress.create({
          userId,
          sectionId,
          videoOrder: 1,
        });
      }

      const lastVideoOrder = lastVideo.order || 0;
      const currentVideoOrder = progress.videoOrder;

      if (lastVideoOrder <= currentVideoOrder) {
        return sendError(res, {
          error: "You are done this section!",
          status: 404,
        });
      }

      progress.videoOrder = currentVideoOrder + 1;
      await progress.save();

      sendSucces(res, { status: 200, data: { progress } });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };
}
module.exports = ProgressControllers;
