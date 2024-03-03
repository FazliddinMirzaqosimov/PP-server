const Purchase = require("../models/purchaseModel");
const File = require("../models/fileModel");
const PurchaseRequest = require("../models/purchaseRequestModel");
const { sendSucces, sendError } = require("../utils/senData");
const APIFeatures = require("../utils/apiFeatures");
const { deleteFile } = require("../utils/s3/deleteFile");

class PurchaseRequestController {
  static async getAll(req, res) {
    try {
      const purchaseRequestQuery = new APIFeatures(
        PurchaseRequest.find().populate([
          {
            path: "user",
            select: "role phone email fullName profileImage",
            populate: {
              path: "profileImage",
              model: "File",
              select: "location",
            },
          },
          {
            path: "file",
            select: "location",
          },
          {
            path: "purchase",
            select: "amount createdAt",
          },
        ]),

        req.query
      )
        .sort()
        .filter()
        .paginate()
        .limitFields();

      const purchaseRequests = await purchaseRequestQuery.query;
      sendSucces(res, {
        data: purchaseRequests,
        meta: {
          length: purchaseRequests.length,
          limit: req.query.limit || 100,
          page: req.query.page || 1,
        },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  }

  // Delete user
  static delete = async (req, res) => {
    try {
      const id = req.params.id;

      const purchaseRequest = await PurchaseRequest.findByIdAndDelete(id);

      const file = await File.findByIdAndDelete(purchaseRequest.file);

      deleteFile(file.filename);

      sendSucces(res, { status: 204 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  //Send Purchase if user wants to purchase to his account
  static accept = async (req, res) => {
    //Keyinro kuniga limitli  purchase request qiliwni korib ciqiw kere
    try {
      const { amount, purchaseRequestId } = req.body;

      if (!purchaseRequestId) {
        return sendError(res, {
          error: "purchaseRequestId is missing!",
          status: 404,
        });
      }
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
      if (!req.file) {
        return sendError(res, {
          error: `Cannot find file!`,
          status: 404,
        });
      }
      const user = req.user;

      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const latestRequestIn24 = await PurchaseRequest.findOne({
        user: user._id,
      }).sort("-createdAt");

      if (latestRequestIn24) {
        deleteFile(req.file.key);
        return sendError(res, {
          error: `1 purchase request allowed in 1 day!  ${twentyFourHoursAgo.toISOString()} ${latestRequestIn24.createdAt.toISOString()}`,
          status: 404,
        });
      }

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
