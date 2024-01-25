const express = require("express");
  const { routeProtector } = require("../middlewares/routeProtector");
const PlanControllers = require("../controllers/planController");

const planRouter = express.Router();

planRouter
  .route("/")
  .get(PlanControllers.getAll)
  .post(routeProtector, PlanControllers.create);

planRouter
  .route("/:id")
  .delete(routeProtector, PlanControllers.delete)
  .patch(routeProtector, PlanControllers.edit)
  .get(PlanControllers.get);

module.exports = planRouter;
