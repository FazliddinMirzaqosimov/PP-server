const { sendError, sendSucces } = require("../utils/senData");
const { passwordValidator } = require("../utils/validators/passwordValidator");
const APIFeatures = require("../utils/apiFeatures");
const Course = require("../models/courseModel");
const File = require("../models/fileModel");
const { deleteFile } = require("../utils/s3/deleteFile");

class CourseControllers {
  // Get all course list
  static getAll = async (req, res) => {
    try {
      const coursesQuery = new APIFeatures(
        Course.find().populate("image"),
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
      const { chat, title, description } = req.body;
      const userId = req.user._id;

      const course = await Course.create({
        chat,
        title,
        description,
        userId,
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
          error: "Couldnt find course with this id!",
          status: 404,
        });
      }

      if (course.image) {
        const file = await File.findByIdAndUpdate(
          course.image,
          {
            filename: req.file.key,
            size: req.file.size,
            location: req.file.location || `${FILE_URL}/${req.file.key}`,
          },
          {
            upsert: true, // Create a new document if no document is found
          }
        );
        file?.filename && deleteFile(file.filename);
      } else {
        const file = await File.create({
          filename: req.file.key,
          size: req.file.size,
          location: req.file.location || `${FILE_URL}/${req.file.key}`,
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

      const course = await Course.findById(id).populate("image");
      sendSucces(res, { status: 200, data: { course } });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Delete course
  static delete = async (req, res) => {
    try {
      const id = req.params.id;

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

      const { chat, title, description, image } = req.body;
      const userId = req.user._id;

      const course = await Course.findByIdAndUpdate(
        id,
        {
          chat,
          title,
          description,
          userId,
          image,
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
