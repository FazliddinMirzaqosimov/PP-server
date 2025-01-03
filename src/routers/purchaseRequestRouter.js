const express = require("express");
const { routeProtector } = require("../middlewares/routeProtector");
const { allowTo } = require("../middlewares/roleFilter");
const PurchaseRequestController = require("../controllers/purchaseRequestController");
const upload = require("../middlewares/fileUpload");

const purchaseRequestRouter = express.Router();

purchaseRequestRouter
  .route("/")
  .get(
    routeProtector,
    allowTo("admin", "superadmin"),
    PurchaseRequestController.getAll
  );

purchaseRequestRouter
  .route("/:id")
  .delete(
    routeProtector,
    allowTo("admin", "superadmin"),
    PurchaseRequestController.delete
  );

  purchaseRequestRouter
  .route("/send")
  .post(
    routeProtector,
    upload("purchaseRequests",2).single("file"),
    PurchaseRequestController.send
  );

  purchaseRequestRouter
  .route("/accept-from-bot/:id")
  .get(
     PurchaseRequestController.acceptFromBot
  );

purchaseRequestRouter
  .route("/duplicate")
  .post(
    routeProtector,
    allowTo("admin", "superadmin"),
    PurchaseRequestController.duplicateRequest
  );

purchaseRequestRouter
  .route("/accept")
  .post(
    routeProtector,
    allowTo("admin", "superadmin"),
    PurchaseRequestController.accept
  );

module.exports = purchaseRequestRouter;
