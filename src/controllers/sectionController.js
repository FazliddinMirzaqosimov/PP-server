const { sendError, sendSucces } = require("../utils/senData");
const { passwordValidator } = require("../utils/validators/passwordValidator");
const APIFeatures = require("../utils/apiFeatures");
const Section = require("../models/sectionModel");
const Progress = require("../models/progressModel");
const { deleteFile } = require("../utils/s3/deleteFile");
const File = require("../models/fileModel");
const { FILE_URL } = require("../shared/const");
const Video = require("../models/videoModel");

class SectionControllers {
  // Get all section
  static getAll = async (req, res) => {
    try {
      const sectionsQuery = new APIFeatures(
        Section.find(
          // !req?.user?.role || req.user.role === "user" ? { status: 1 } : {}
        ).populate([{ path: "image" }, { path: "courseId", select: "title" }]),
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
      let { priority, title, description, image, courseId, userId, status } =
        req.body;
      userId = userId || req.user._id;

      const section = await Section.create({
        title,
        description,
        userId,
        image,
        courseId,
        priority,
        status,
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
      const section = await Section.findOne(
        !req?.user?.role || req.user.role === "user"
          ? { status: 1, _id: id }
          : { _id: id }
      ).populate("image");
      
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
          error: "Seksiya topilmadi",
          status: 404,
        });
      }
      if (section.image) {
        const file = await File.findByIdAndUpdate(
          section.image,
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
      const video = await Video.findOne({ sectionId: id });
      if (video) {
        return sendError(res, {
          error: "Seksiyada video mavjud!",
          status: 404,
        });
      }
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

      const { chat, title, description, image, courseId, status, priority } =
        req.body;
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
          status,
          priority,
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
