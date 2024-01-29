const express = require("express");
const AuthControllers = require("../controllers/authController");
const CourseSectionControllers = require("../controllers/courseSectionController");
const { routeProtector } = require("../middlewares/routeProtector");
const { allowTo } = require("../middlewares/roleFilter");

const courseSectionRouter = express.Router();

courseSectionRouter
  .route("/")
  .get( CourseSectionControllers.getAll)
  .post(routeProtector,allowTo("admin","superadmin"), CourseSectionControllers.create);

courseSectionRouter
  .route("/:id")
  .delete(routeProtector,allowTo("admin","superadmin"), CourseSectionControllers.delete)
  .patch(routeProtector,allowTo("admin","superadmin"), CourseSectionControllers.edit)
  .get( CourseSectionControllers.get);

module.exports = courseSectionRouter;
