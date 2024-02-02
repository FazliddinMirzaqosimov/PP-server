const express = require("express");
 const FileControllers = require("../controllers/fileController");

const fileRouter = express.Router();

fileRouter
  .route("/")
  .get(FileControllers.getAll)
  .post(FileControllers.create);

fileRouter
  .route("/:id")
  .delete(FileControllers.delete)
  .get(FileControllers.get);

module.exports = fileRouter;
