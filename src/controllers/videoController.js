const { sendError, sendSucces } = require("../utils/senData");
const APIFeatures = require("../utils/apiFeatures");
const Video = require("../models/videoModel");

class VideoControllers {
  // Get all videolist
  static getAll = async (req, res) => {
    try {
      const videoQuery = new APIFeatures(Video.find(), req.query)
        .sort()
        .filter()
        .paginate()
        .limitFields();

      const video = await videoQuery.query;

      sendSucces(res, {
        data: {
          meta: {
            result: video.length,
            page: videoQuery.page,
            limit: videoQuery.limit,
          },
          video,
        },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Create videolist
  static create = async (req, res) => {
    try {
      let { videoId, title, description, duration, sectionId, order } =
        req.body;

      const lastVideo = await Video.findOne({
        sectionId,
      }).sort({ order: -1 });
      const lastVideoOrder = lastVideo?.order || 0;

      if (!order) {
        order = lastVideoOrder + 1;
      } else if (!Number.isInteger(order)) {
        return sendError(res, { error: "Order must be integer!", status: 404 });
      } else if (order < 0) {
        return sendError(res, {
          error: "Order must be greater then 0!",
          status: 404,
        });
      } else if (order > lastVideoOrder + 1) {
        order = lastVideoOrder + 1;
      } else {
    
        await Video.updateMany(
          { sectionId, order: { $gte: order } },
          { $inc: { order: 1 } }
        );
      }
      const existVideo = await Video.findOne({ order, sectionId });

      if (existVideo) {
        return sendError(res, {
          error: "Video with this order is already exist in this course section!",
          status: 404,
        });
      }

      const video = await Video.create({
        videoId,
        title,
        description,
        duration,
        sectionId,
        order,
      });
      sendSucces(res, { data: { video }, status: 200 });
    } catch (error) {
       sendError(res, { error: error.message, status: 404 });
    }
  };

  // Get videolist
  static get = async (req, res) => {
    try {
      const id = req.params.id;

      const video = await Video.findById(id);
      sendSucces(res, { status: 200, data: { video } });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Delete videolist
  static delete = async (req, res) => {
    try {
      const id = req.params.id;

      await Video.findByIdAndDelete(id);
      sendSucces(res, { status: 204 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Edit videolist
  static edit = async (req, res) => {
    try {
      const id = req.params.id;

      const { videoId, title, description, sectionId } = req.body;

      const video = await Video.findByIdAndUpdate(
        id,
        {
          videoId,
          title,
          description,
          sectionId,
        },
        { new: true, runValidators: true }
      );
      sendSucces(res, { data: { video }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };
}

module.exports = VideoControllers;
