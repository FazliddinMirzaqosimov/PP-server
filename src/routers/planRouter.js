const express = require("express");
  const { routeProtector } = require("../middlewares/routeProtector");
const PlanControllers = require("../controllers/planController");
const { allowTo } = require("../middlewares/roleFilter");

const planRouter = express.Router();

planRouter
  .route("/")
  .get(PlanControllers.getAll)
  .post(routeProtector,allowTo("admin","superadmin"), PlanControllers.create);

planRouter
  .route("/:id")
  .delete(routeProtector,allowTo("admin","superadmin"), PlanControllers.delete)
  .patch(routeProtector,allowTo("admin","superadmin"), PlanControllers.edit)
  .get(PlanControllers.get);

module.exports = planRouter;
