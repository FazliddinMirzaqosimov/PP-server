const express = require("express");
 const PurchaseControllers = require("../controllers/purchaseControllers");
const { routeProtector } = require("../middlewares/routeProtector");

const purchaseRouter = express.Router();

purchaseRouter
  .route("/")
  .get(routeProtector, PurchaseControllers.getAll)
  .post(routeProtector,allowTo("admin","superadmin"), PurchaseControllers.create);

  purchaseRouter
  .route("/:id")
  .delete(routeProtector,allowTo("admin","superadmin"), PurchaseControllers.delete)
  .patch(routeProtector,allowTo("admin","superadmin"), PurchaseControllers.edit)
  .get(routeProtector, PurchaseControllers.get);

module.exports = purchaseRouter;
