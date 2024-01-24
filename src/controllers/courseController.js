const { sendError, sendSucces } = require("../utils/senData");
const { passwordValidator } = require("../utils/validators/passwordValidator");
const APIFeatures = require("../utils/apiFeatures");
const Course = require("../models/courseModel");

class CourseControllers {
  // Get all course list
  static getAll = async (req, res) => {
    try {
      const coursesQuery = new APIFeatures(Course.find(), req.query)
        .sort()
        .filter()
        .paginate()
        .limitFields();

      const courses = await coursesQuery.query;

      sendSucces(res, {
        data: {
          meta: {
            result: courses.length,
            page: coursesQuery.page,
            limit: coursesQuery.limit,
          },
          courses,
        },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Create course section list
  static create = async (req, res) => {
    try {
     

      const { chat, title, description, image } = req.body;
      const userId = req.user._id;

      const course = await Course.create({
        chat,
        title,
        description,
        userId,
        image,
      });
      sendSucces(res, { data: { course }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Get course section list
  static get = async (req, res) => {
    try {
      const id = req.params.id;

      const course = await Course.findById(id);
      sendSucces(res, { status: 200, data: { course } });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Delete course section list
  static delete = async (req, res) => {
    try {
   
      const id = req.params.id;

      await Course.findByIdAndDelete(id);
      sendSucces(res, { status: 204 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Edit course section list
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
