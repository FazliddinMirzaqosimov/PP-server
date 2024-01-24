const { sendError, sendSucces } = require("../utils/senData");
const { passwordValidator } = require("../utils/validators/passwordValidator");
const APIFeatures = require("../utils/apiFeatures");
const CourseSection = require("../models/courseSectionModel");

class CourseSectionControllers {
  // Get all courseSectionlist
  static getAll = async (req, res) => {
    try {
      const courseSectionsQuery = new APIFeatures(
        CourseSection.find(),
        req.query
      )
        .sort()
        .filter()
        .paginate()
        .limitFields();

      const courseSections = await courseSectionsQuery.query;

      sendSucces(res, {
        data: {
          meta: {
            result: courseSections.length,
            page: courseSectionsQuery.page,
            limit: courseSectionsQuery.limit,
          },
          courseSections,
        },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Create courseSectionlist
  static create = async (req, res) => {
    try {
   

      const { chat, title, description, image, courseId } = req.body;
      const userId = req.user._id;

      const courseSection = await CourseSection.create({
        chat,
        title,
        description,
        userId,
        image,
        courseId,
      });
      sendSucces(res, { data: { courseSection }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Get courseSectionlist
  static get = async (req, res) => {
    try {
      const id = req.params.id;

      const courseSection = await CourseSection.findById(id);
      sendSucces(res, { status: 200, data: { courseSection } });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Delete courseSectionlist
  static delete = async (req, res) => {
    try {
   
      const id = req.params.id;

      await CourseSection.findByIdAndDelete(id);
      sendSucces(res, { status: 204 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Edit courseSectionlist
  static edit = async (req, res) => {
    try {
   
      const id = req.params.id;

      const { chat, title, description, image, courseId } = req.body;
      const userId = req.user._id;

      const courseSection = await CourseSection.findByIdAndUpdate(
        id,
        {
          chat,
          title,
          description,
          userId,
          image,
          courseId,
        },
        { new: true, runValidators: true }
      );
      sendSucces(res, { data: { courseSection }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };
}

module.exports = CourseSectionControllers;
