const express = require("express");
const SectionControllers = require("../controllers/sectionController");
const { routeProtector } = require("../middlewares/routeProtector");
const { allowTo } = require("../middlewares/roleFilter");
const upload = require("../middlewares/fileUpload");

const sectionRouter = express.Router();

sectionRouter
  .route("/")
  .get(routeProtector,SectionControllers.getAll)
  .post(
    routeProtector,
    allowTo("admin", "superadmin"),
    SectionControllers.create
  );

sectionRouter
  .route("/:id")
  .delete(
    routeProtector,
    allowTo("admin", "superadmin"),
    SectionControllers.delete
  )
  .patch(
    routeProtector,
    allowTo("admin", "superadmin"),
    SectionControllers.edit
  )
  .get(routeProtector,SectionControllers.get);

sectionRouter
  .route("/upload-photo/:id")
  .post(
    routeProtector,
    allowTo("admin", "superadmin"),
    upload("sectionPhoto", 20).single("image"),
    SectionControllers.uploadPhoto
  );

module.exports = sectionRouter;
