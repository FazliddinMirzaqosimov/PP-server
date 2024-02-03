 


const express = require("express");
const { routeProtector } = require("../middlewares/routeProtector");
const { allowTo } = require("../middlewares/roleFilter");
const PurchaseRequestController = require("../controllers/purchaseRequestController");
 
const purchaseRequestRouter = express.Router();

purchaseRequestRouter.route("/send").post(routeProtector, PurchaseRequestController.send);




purchaseRequestRouter
  .route("/duplicate-request/:id")
  .post(routeProtector,allowTo("admin","superadmin"), PurchaseRequestController.duplicateRequest);



  purchaseRequestRouter
  .route("/accept/:id")
  .post(routeProtector, allowTo("admin","superadmin"),PurchaseRequestController.accept);

module.exports = purchaseRequestRouter;
