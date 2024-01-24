const express = require("express");
const AuthControllers = require("../controllers/authController");
const CourseSectionControllers = require("../controllers/courseSectionController");
const { routeProtector } = require("../middlewares/routeProtector");

const courseSectionRouter = express.Router();

courseSectionRouter
  .route("/")
  .get(routeProtector,CourseSectionControllers.getAll)
  .post(routeProtector, CourseSectionControllers.create);

courseSectionRouter
  .route("/:id")
  .delete(routeProtector, CourseSectionControllers.delete)
  .patch(routeProtector, CourseSectionControllers.edit)
  .get(routeProtector,CourseSectionControllers.get);

module.exports = courseSectionRouter;
