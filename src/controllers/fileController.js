const { deleteFile } = require("../utils/s3/deleteFile");

class FileControllers {
  static async getAll(req, res) {
    try {
      const fileQuery = new APIFeatures(File.find(), req.query)
        .sort()
        .filter()
        .paginate()
        .limitFields();
      const files = await fileQuery.query;
      sendSucces(res, { result: files.length, files }, 200);
    } catch (error) {
      sendError(res, error.message, 404);
    }
  }

  static async get(req, res) {
    try {
      const file = await File.findById(req.params.id);

      sendSucces(res, { file }, 200);
    } catch (error) {
      sendError(res, error.message, 404);
    }
  }

  static async delete(req, res) {
    try {
      const file = await File.findByIdAndDelete(req.params.id);
      deleteFile(file.filename);

      sendSucces(res, { file }, 204);
    } catch (error) {
      sendError(res, error.message, 404);
    }
  }

  static async create(req, res) {
    try {
      const files = req.files.map((file) => {
        return { filename: file.filename };
      });
      const file = await File.insertMany(files);
      sendSucces(res, { file }, 200);
    } catch (error) {
      req.files?.forEach((media) => {
        deleteFile(media.key);
      });

      sendError(res, error.message, 404);
    }
  }
}

module.exports = FileControllers;
