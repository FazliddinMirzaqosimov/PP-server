const express = require("express");
const SectionControllers = require("../controllers/sectionController");
const { routeProtector } = require("../middlewares/routeProtector");
const { allowTo } = require("../middlewares/roleFilter");

const sectionRouter = express.Router();

sectionRouter
  .route("/")
  .get( SectionControllers.getAll)
  .post(routeProtector,allowTo("admin","superadmin"), SectionControllers.create);

sectionRouter
  .route("/:id")
  .delete(routeProtector,allowTo("admin","superadmin"), SectionControllers.delete)
  .patch(routeProtector,allowTo("admin","superadmin"), SectionControllers.edit)
  .get( SectionControllers.get);

module.exports = sectionRouter;
