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
      const total = await File.countDocuments();

      sendSucces(res, {
        data: files,
        meta: {
          length: files.length,
          limit: req.query.limit || 100,
          page: req.query.page || 1,total
        },
        status: 200,
      });    } catch (error) {
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
      deleteFile(file.location);

      sendSucces(res, { data: { file }, status: 204 });
    } catch (error) {
      sendError(res, {error:error.message, status: 404});
    }
  }

   
}

module.exports = FileControllers;
