const Purchase = require("../models/purchaseModel");
const File = require("../models/fileModel");
const PurchaseRequest = require("../models/purchaseRequestModel");
const { sendSucces, sendError } = require("../utils/senData");
const APIFeatures = require("../utils/apiFeatures");
const { deleteFile } = require("../utils/s3/deleteFile");
const { FILE_URL, NODE_ENVIRONMENT } = require("../shared/const");
const { sendToAdmins } = require("../utils/botMessages");
const bot = require("../bot");
const { Markup } = require("telegraf");
const getFilterObject = require("../utils/getFilterObject");

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

      const filterObject = getFilterObject(PurchaseRequest, req.query);
      const total = await PurchaseRequest.countDocuments(filterObject);
      sendSucces(res, {
        data: purchaseRequests,
        meta: {
          length: purchaseRequests.length,
          limit: req.query.limit || 100,
          page: req.query.page || 1,
          total,
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

  //Send Purchase if user wants to purchase to his account
  static acceptFromBot = async (req, res) => {
    //Keyinro kuniga limitli  purchase request qiliwni korib ciqiw kere
    try {
      const { adminId, amount } = req.query;
      const { id } = req.params;
      console.log({ id });
      if (!adminId) {
        return res.send("<h1>There is no adminId</h1>");
      }

      if (amount && !isNaN(amount)) {
        const purchaseRequest = await PurchaseRequest.findById(id).populate({
          path: "user",
          select: "email",
        });
        console.log({ purchaseRequest });
        if (!purchaseRequest) {
          return sendSucces(res, {
            type: "send",
            data: "<h1>There is no  purchase request with this id!</h1>",
          });
        }
        if (purchaseRequest.purchase) {
          return sendSucces(res, {
            type: "send",
            data: "<h1>You already purchased to this request!</h1>",
          });
        }

        const purchase = await Purchase.create({
          amount,
          userId: purchaseRequest.user._id,
        });

        purchaseRequest.purchase = purchase._id;
        purchaseRequest.status = "active";
        await purchaseRequest.save();

        return res.send(
          `<h1>SUCCESSFULLY purchased ${amount}$ to ${purchaseRequest.user.email}</h1>`
        );
      }
      const purchaseRequest = await PurchaseRequest.findById(id).populate([
        {
          path: "user",
          select: "role fullName email file",
          populate: {
            path: "profileImage",
            select: "location",
          },
        },
        {
          path: "file",
          select: "location",
        },
      ]);
      const history = await PurchaseRequest.find({
        user: purchaseRequest.user._id,
      }).populate({
        path: "file",
        select: "location",
      });
      res.status(200).render("purchaseRequest.ejs", {
        purchaseRequest,
        history,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  static duplicateRequest = async (req, res) => {
    try {
      const { purchaseRequestId } = req.body;

      const purchaseRequest = await PurchaseRequest.findByIdAndUpdate(
        purchaseRequestId,
        {
          status: "duplicate",
        },
        { new: true, runValidators: true }
      );

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

      // if (NODE_ENVIRONMENT !== "development") {
      const latestRequestsIn24 = await PurchaseRequest.find({
        user: user._id,
      }).sort("-createdAt");

      if (latestRequestsIn24.length >= 3) {
        deleteFile(req.file.key);
        return sendError(res, {
          error: `3 purchases request allowed in 1 day!  ${twentyFourHoursAgo.toISOString()} ${latestRequestsIn24[0].createdAt.toISOString()}`,
          status: 404,
        });
      }
      // }

      const file = await File.create({
        filename: req.file.key,
        size: req.file.size,
        location: req.file.location || `${FILE_URL}/${req.file.key}`,
      });
      const purchaseRequest = await PurchaseRequest.create({
        user: user._id,
        file: file._id,
      });

      sendToAdmins((adminId) =>
        bot.telegram.sendPhoto(adminId, file.location, {
          // reply_markup: Markup.inlineKeyboard([
          //   Markup.button.webApp("Open", "https://app.fazliddin.dev"),
          //   Markup.button.url("Open Link", "https://example.com"),
          //   Markup.button.callback("Press Me", "press"),
          // ]),
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Open Link",
                  web_app: { url: "https://fazliddin.dev" },
                },
                { text: "Press Me", callback_data: "press" },
              ],
            ],
          },
          caption: "This is an image",
        })
      );

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
