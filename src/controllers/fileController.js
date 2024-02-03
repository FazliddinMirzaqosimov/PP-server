const { deleteFile } = require("../utils/s3/deleteFile");
const { sendSucces, sendError } = require("../utils/senData");
const APIFeatures = require("../utils/apiFeatures");
const File = require("../models/fileModel");
const { FILE_URL } = require("../shared/const");

class FileControllers {
  static async getAll(req, res) {
    try {
      const fileQuery = new APIFeatures(File.find(), req.query)
        .sort()
        .filter()
        .paginate()
        .limitFields();
      const files = await fileQuery.query;
      sendSucces(res, { data: { result: files.length, files }, status: 200 });
    } catch (error) {
      sendError(res, {error:error.message, status: 404});
    }
  }

  static async get(req, res) {
    try {
      const file = await File.findById(req.params.id);

      sendSucces(res, { data: { file }, status: 200 });
    } catch (error) {
      sendError(res, {error:error.message, status: 404});
    }
  }

  static async delete(req, res) {
    try {
      const file = await File.findByIdAndDelete(req.params.id);
      deleteFile(file.filename);

      sendSucces(res, { data: { file }, status: 204 });
    } catch (error) {
      sendError(res, {error:error.message, status: 404});
    }
  }

  static async create(req, res) {
    try {
      const files = req.files.map((file) => {
        return {
          filename: file.key,
          size: file.size,
          location: file.location || `${FILE_URL}/${file.key}`,
        };
      });
      const file = await File.insertMany(files);
      sendSucces(res, { data: { file }, status: 201 });
    } catch (error) {
      req.files?.forEach((media) => {
        deleteFile(media.key);
      });

      sendError(res, { error: error.message, status: 404 });
    }
  }
}

module.exports = FileControllers;
