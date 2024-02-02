const { sendError, sendSucces } = require("../utils/senData");
const { passwordValidator } = require("../utils/validators/passwordValidator");
const APIFeatures = require("../utils/apiFeatures");
const Section = require("../models/sectionModel");
const Progress = require("../models/progressModel");

class SectionControllers {
  // Get all sectionlist
  static getAll = async (req, res) => {
    try {
      const sectionsQuery = new APIFeatures(Section.find(), req.query)
        .sort()
        .filter()
        .paginate()
        .limitFields();

      const sections = await sectionsQuery.query;

      sendSucces(res, {
        data: {
          meta: {
            result: sections.length,
            page: sectionsQuery.page,
            limit: sectionsQuery.limit,
          },
          sections,
        },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Create sectionlist
  static create = async (req, res) => {
    try {
      let { order, chat, title, description, image, courseId, userId } =
        req.body;
      userId = userId || req.user._id;

      const lastSection = await Section.findOne({
        courseId,
      }).sort({ order: -1 });
      const lastSectionOrder = lastSection?.order || 0;

      if (!order) {
        order = lastSectionOrder + 1;
      } else if (!Number.isInteger(order)) {
        return sendError(res, { error: "Order must be integer!", status: 404 });
      } else if (order < 0) {
        return sendError(res, {
          error: "Order must be greater then 0!",
          status: 404,
        });
      } else if (order > lastSectionOrder + 1) {
        order = lastSectionOrder + 1;
      } else {
        console.log(1);
        const res = await Section.updateMany(
          { courseId, order: { $gte: order } },
          { $inc: { order: 1 } }
        );
      }
      const existSection = await Section.findOne({ order, courseId });

      if (existSection) {
        return sendError(res, {
          error: "Section with this order is already exist in this course!",
          status: 404,
        });
      }

      const section = await Section.create({
        chat,
        title,
        description,
        userId,
        image,
        courseId,
        order,
      });
      sendSucces(res, { data: { section }, status: 200 });
    } catch (error) {
      console.log({ error });
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Get sectionlist
  static get = async (req, res) => {
    try {
      const id = req.params.id;
      const section = await Section.findById(id);
      sendSucces(res, { status: 200, data: { section } });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  
 



  // Delete sectionlist
  static delete = async (req, res) => {
    try {
      const id = req.params.id;

      await Section.findByIdAndDelete(id);
      sendSucces(res, { status: 204 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Edit sectionlist
  static edit = async (req, res) => {
    try {
      const id = req.params.id;

      const { chat, title, description, image, courseId } = req.body;
      const userId = req.user._id;

      const section = await Section.findByIdAndUpdate(
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
      sendSucces(res, { data: { section }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };
}

module.exports = SectionControllers;
