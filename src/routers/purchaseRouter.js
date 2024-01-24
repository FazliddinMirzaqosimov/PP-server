const express = require("express");
 const PurchaseControllers = require("../controllers/purchaseControllers");
const { routeProtector } = require("../middlewares/routeProtector");

const purchaseRouter = express.Router();

purchaseRouter
  .route("/")
  .get(routeProtector, PurchaseControllers.getAll)
  .post(routeProtector, PurchaseControllers.create);

  purchaseRouter
  .route("/:id")
  .delete(routeProtector, PurchaseControllers.delete)
  .patch(routeProtector, PurchaseControllers.edit)
  .get(routeProtector, PurchaseControllers.get);

module.exports = purchaseRouter;
