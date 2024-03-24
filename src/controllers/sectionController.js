const { sendError, sendSucces } = require("../utils/senData");
const { passwordValidator } = require("../utils/validators/passwordValidator");
const APIFeatures = require("../utils/apiFeatures");
const Section = require("../models/sectionModel");
const Progress = require("../models/progressModel");
const { deleteFile } = require("../utils/s3/deleteFile");
const File = require("../models/fileModel");
const { FILE_URL } = require("../shared/const");

class SectionControllers {
  // Get all section
  static getAll = async (req, res) => {
    try {
      const sectionsQuery = new APIFeatures(
        Section.find().populate([
          { path: "image" },
          { path: "courseId", select: "title" },
        ]),
        req.query
      )
        .sort()
        .filter()
        .paginate()
        .limitFields();

      const sections = await sectionsQuery.query;
      const total = await Section.countDocuments();

      sendSucces(res, {
        data: sections,
        meta: {
          length: sections.length,
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

  // Create section
  static create = async (req, res) => {
    try {
      let { order, title, description, image, courseId, userId } = req.body;
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
        await Section.updateMany(
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

  // Get section
  static get = async (req, res) => {
    try {
      const id = req.params.id;
      const section = await Section.findById(id).populate("image");
      sendSucces(res, { status: 200, data: { section } });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // upload photo to section
  static uploadPhoto = async (req, res) => {
    try {
      const sectionId = req.params.id;
      const section = await Section.findById(sectionId);
      if (!section) {
        return sendError(res, {
          error: "Couldnt find section with this id!",
          status: 404,
        });
      }
      if (section.image) {
        const file = await File.findByIdAndUpdate(
          section.image,
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

        section.image = file._id;
        await section.save();
      }

      sendSucces(res, {
        data: { message: "Image succassfully updated/created." },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Delete section
  static delete = async (req, res) => {
    try {
      const id = req.params.id;

      await Section.findByIdAndDelete(id);
      sendSucces(res, { status: 204 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Edit section
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
