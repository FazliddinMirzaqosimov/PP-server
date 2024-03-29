const { sendError, sendSucces } = require("../utils/senData");
const { passwordValidator } = require("../utils/validators/passwordValidator");
const APIFeatures = require("../utils/apiFeatures");
const Course = require("../models/courseModel");
const File = require("../models/fileModel");
const { deleteFile } = require("../utils/s3/deleteFile");
const Video = require("../models/videoModel");
const Section = require("../models/sectionModel");

class CourseControllers {
  // Get all course list
  static getAll = async (req, res) => {
    try {
      const coursesQuery = new APIFeatures(
        Course.find(
          !req?.user?.role || req.user.role === "user" ? { status: 1 } : {}
        ).populate("image"),
        req.query
      )
        .sort()
        .filter()
        .paginate()
        .limitFields();

      const courses = await coursesQuery.query;
      const total = await Course.countDocuments();

      sendSucces(res, {
        data: courses,
        meta: {
          length: courses.length,
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

  // Create course
  static create = async (req, res) => {
    try {
      const {
        chat,
        title,
        description,
        type,
        user,
        priority,
        teacherName,
        status,
      } = req.body;
      const userId = req.user._id || user;

      const course = await Course.create({
        chat,
        title,
        description,
        userId,
        type,
        priority,
        teacherName,
        status,
      });

      sendSucces(res, { data: { course }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // update photo of course
  static uploadPhoto = async (req, res) => {
    try {
      const courseId = req.params.id;
      const course = await Course.findById(courseId);
      if (!course) {
        return sendError(res, {
          error: "Shu id da kurs topilmadi!",
          status: 404,
        });
      }

      if (course.image) {
        const file = await File.findByIdAndUpdate(
          course.image,
          {
            filename: req.file.filename,
            size: req.file.size,
            location: req.uploadPath,
          },
          {
            upsert: true, // Create a new document if no document is found
          }
        );
        file?.location && deleteFile(file.location);
      } else {
        const file = await File.create({
          filename: req.file.filename,
          size: req.file.size,
          location: req.uploadPath,
        });

        course.image = file._id;
        await course.save();
      }

      sendSucces(res, {
        data: { message: "Image succassfully updated/created." },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Get a course
  static get = async (req, res) => {
    try {
      const id = req.params.id;

      const course = await Course.findOne(
        !req?.user?.role || req.user.role === "user"
          ? { status: 1, _id: id }
          : { _id: id }
      ).populate([
        "image",
        {
          path: "trailer",
          // select: "link type"
        },
      ]);
      sendSucces(res, { status: 200, data: { course } });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Get a course
  static addTrailer = async (req, res) => {
    try {
      const courseId = req.params.id;
      const videoId = req.body.videoId;

      const video = await Video.findById(videoId);
      if (!video) {
        return sendError(res, { error: "Video topilmadi", status: 404 });
      }

      const course = await Course.findById(courseId);
      if (!course) {
        return sendError(res, { error: "Kurs topilmadi", status: 404 });
      }

      course.trailer = videoId;
      await course.save();

      sendSucces(res, { status: 200, data: { course } });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Delete course
  static delete = async (req, res) => {
    try {
      const id = req.params.id;
      const section = await Section.findOne({ courseId: id });
      if (section) {
        return sendError(res, { error: "Kursda Section mavjud!", status: 404 });
      }
      await Course.findByIdAndDelete(id);
      sendSucces(res, { status: 204 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Edit course
  static edit = async (req, res) => {
    try {
      const id = req.params.id;

      const {
        chat,
        title,
        description,
        type,
        image,
        priority,
        teacherName,
        status,
      } = req.body;
      const userId = req.user._id;

      const course = await Course.findByIdAndUpdate(
        id,
        {
          chat,
          title,
          description,
          userId,
          image,
          type,
          priority,
          teacherName,
          status,
        },
        { new: true, runValidators: true }
      );
      sendSucces(res, { data: { course }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };
}
module.exports = CourseControllers;
