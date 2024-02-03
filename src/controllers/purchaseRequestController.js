const Purchase = require("../models/purchaseModel");
const PurchaseRequest = require("../models/purchaseRquestModel");
const { sendSucces } = require("../utils/senData");

class PurchaseRequestController {
  //Send Purchase if user wants to purchase to his account
  static accept = async (req, res) => {
    //Keyinro kuniga limitli  purchase request qiliwni korib ciqiw kere
    try {
      const { amount } = req.body;
      const purchaseRequestId = req.body.id;

      if (!amount) {
        return sendError(res, { error: "Amount is missing!", status: 404 });
      }
      const purchaseRequest = await PurchaseRequest.findById(purchaseRequestId);

      if (!purchaseRequest) {
        return sendError(res, {
          error: "There is no  purchase request with this id!",
          status: 404,
        });
      }
      if (purchaseRequest.purchase) {
        return sendError(res, {
          error: "You already purchased to this request!",
          status: 404,
        });
      }

      const purchase = await Purchase.create({
        amount,
        userId: purchaseRequest.user,
      });

      purchaseRequest.purchase = purchase._id;
      purchaseRequest.status = "active";
      await purchaseRequest.save();
      sendSucces(res, {
        data: {
          purchaseRequest,
          message: "Purchase is successfully created!",
        },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  static duplicateRequest = async (req, res) => {
    try {
      const purchaseRequestId = req.body.id;

      const purchaseRequest = await PurchaseRequest.findById(purchaseRequestId);
      purchaseRequest.status = "duplicate";
      await purchaseRequest.save();

      sendSucces(res, {
        data: {
          purchaseRequest,
          message: "Purchase request is successfully changed to duplicate!",
        },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  //Send Purchase if user wants to purchase to his account
  static send = async (req, res) => {
    try {
      const user = req.user;
      const file = await File.create({
        filename: req.file.key,
        size: req.file.size,
        location: req.file.location || `${FILE_URL}/${req.file.key}`,
      });
      const purchaseRequest = await PurchaseRequest.create({
        user: user._id,
        file: file._id,
      });
      sendSucces(res, {
        data: {
          purchaseRequest,
        },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };
}

module.exports = PurchaseRequestController;
