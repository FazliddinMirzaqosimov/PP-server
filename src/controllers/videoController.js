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
 

      const { videoId, title, description, courseSectionId } = req.body;

      const video = await Video.create({
        videoId,
        title,
        description,
        courseSectionId,
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

      const { videoId, title, description, courseSectionId } = req.body;

      const video = await Video.findByIdAndUpdate(
        id,
        {
          videoId,
          title,
          description,
          courseSectionId,
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
