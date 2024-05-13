const { sendError, sendSucces } = require("../utils/senData");
const APIFeatures = require("../utils/apiFeatures");
const Video = require("../models/videoModel");
const Section = require("../models/sectionModel");
const axios = require("axios");
const getDuration = require("../utils/getDuration");
const { YOUTUBE_API_KEY } = require("../shared/const");

class VideoControllers {
  // Get all video
  static getAll = async (req, res) => {
    try {
      const videoQuery = new APIFeatures(
        Video.find(
          !req?.user?.role || req.user.role === "user" ? { status: 1 } : {}
        ).populate([
          {
            path: "courseId",
            select: "title",
          },
          {
            path: "sectionId",
            select: "title",
          },
        ]),
        req.query
      )
        .sort()
        .filter()
        .paginate()
        .limitFields();

      const video = await videoQuery.query;
      const total = await Video.countDocuments();

      sendSucces(res, {
        data: video,
        meta: {
          length: video.length,
          limit: req.query.limit || 100,
          page: req.query.page || 1,
          total,
        },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Create video
  static create = async (req, res) => {
    try {
      let {
        link,
        type,
        title,
        description,
        duration,
        courseId,
        sectionId,
        order,
        status,
      } = req.body;

      const section = await Section.findOne({
        _id: sectionId,
        courseId,
      });
      if (!section) {
        return sendError(res, { error: "Seksiya topilmadi!", status: 404 });
      }

      const lastVideo = await Video.findOne({
        sectionId,
      }).sort({ order: -1 });
      const lastVideoOrder = lastVideo?.order || 0;

      if (!order) {
        order = lastVideoOrder + 1;
      } else if (!Number.isInteger(order)) {
        return sendError(res, {
          error: "Order raqam bo'lishi kerak!",
          status: 404,
        });
      } else if (order < 0) {
        return sendError(res, {
          error: "Order 0dan katta bo'lishi kerak!",
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
          error: "Bu seksiyada shunday order dagi video mavjud!",
          status: 404,
        });
      }

      const video = await Video.create({
        link,
        title,
        description,
        duration,
        sectionId,
        order,
        type,
        courseId,
        status,
      });
      sendSucces(res, { data: { video }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  static createYoutubeList = async (req, res) => {
    try {
      const data = req.body;
      const { sectionId, courseId, playlist } = data;
      const start = +(data.start || 1),
        end = +data.end;
console.log(`https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${data.playlist}&part=contentDetails&key=${YOUTUBE_API_KEY}&maxResults=100`);
      const playlistRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${data.playlist}&part=contentDetails&key=${YOUTUBE_API_KEY}&maxResults=100`,
        {
          headers: {
            Authorization: "AIzaSyC1NRRICm52D3fI8b57lSgTDigJol0-Ugo",
          },
        }
      );
      const videoIds = [];
      let index = start - 1;
      while (index <= (end - 1 || playlistRes?.data?.items?.length)) { 
        if (playlistRes?.data?.items?.[index]) {
          videoIds.push(playlistRes?.data?.items?.[index]?.contentDetails.videoId);
        }
        index++;
      }

      const videosRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoIds}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}&maxResults=50`,
        {
          headers: {
            Authorization: "AIzaSyC1NRRICm52D3fI8b57lSgTDigJol0-Ugo",
          },
        }
      );

      const lastVideo = await Video.findOne({
        sectionId,
      }).sort({ order: -1 });

       const videos = videosRes?.data?.items
        ?.filter(
          (item) =>
            item.contentDetails.duration && item.snippet.title && item.id
        )
        ?.map((item,index) => ({
          order: (lastVideo.order || 0) + index + 1,  
          link: `https://www.youtube.com/embed/${item.id}`,
          title: item.snippet.title,
          description: item.snippet.description,
          duration: getDuration(item.contentDetails.duration),
          sectionId,
          courseId,
          type: "youtube",
          status: 1,
        }));
 
         await Video.insertMany(videos);
 
       sendSucces(res, { status: 200, data: { status: "success" } });
    } catch (error) {
      sendError(res, { error: error , status: 404 });
    }
  };
  // Get video
  static get = async (req, res) => {
    try {
      const id = req.params.id;
      const video = await Video.findOne(
        !req?.user?.role || req.user.role === "user"
          ? { status: 1, _id: id }
          : { _id: id }
      );
      console.log({ video, id, w: "6600173830f80a688658a10e" });
      sendSucces(res, { status: 200, data: { video } });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Delete video
  static delete = async (req, res) => {
    try {
      const id = req.params.id;

      const video = await Video.findById(id).sort({ order: -1 });
      if (!video?.order) {
        return sendError(res, { error: "Video topilmadi", status: 404 });
      }
      const videoOrder = video.order;

      await Video.updateMany(
        { sectionId: video.sectionId, order: { $gt: video.order } },
        { $inc: { order: -1 } }
      );

      await Video.findByIdAndDelete(id);

      return sendSucces(res, { status: 204 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Edit video
  static edit = async (req, res) => {
    try {
      const id = req.params.id;

      let {
        title,
        description,
        sectionId,
        courseId,
        link,
        type,
        duration,
        status,
      } = req.body;

      const video = await Video.findByIdAndUpdate(
        id,
        {
          title,
          description,
          sectionId,
          courseId,
          link,
          type,
          duration,
          status,
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
