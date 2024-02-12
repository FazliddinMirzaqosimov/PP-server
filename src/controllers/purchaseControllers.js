const { sendError, sendSucces } = require("../utils/senData");
const { passwordValidator } = require("../utils/validators/passwordValidator");
const APIFeatures = require("../utils/apiFeatures");
const Purchase = require("../models/purchaseModel");
const Plan = require("../models/planModel");
const User = require("../models/userModel");

class PurchaseControllers {
  // Get all purchase list
  static getAll = async (req, res) => {
    try {
      const purchasesQuery = new APIFeatures(
        Purchase.find({userId:req.user._id}),
        req.query
      )
        .sort()
        .filter()
        .paginate()
        .limitFields();

      const purchases = await purchasesQuery.query;

      sendSucces(res, {
        data: {
          meta: {
            result: purchases.length,
            page: purchasesQuery.page,
            limit: purchasesQuery.limit,
          },
          purchases,
        },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Create purchase  
  static create = async (req, res) => {
    try {
      const { email, amount } = req.body;

      if (amount <= 0) {
        return sendError(res, {
          error: "Amount should be more than 0!",
          status: 404,
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return sendError(res, {
          error: `Cannot find user with this email: ${email}!`,
          status: 404,
        });
      }

      const purchase = await Purchase.create({
        userId: user._id,
        amount,
      });

      sendSucces(res, { data: { purchase }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Get purchase  
  static get = async (req, res) => {
    try {
      const id = req.params.id;

      const purchase = await Purchase.findById(id);
      sendSucces(res, { status: 200, data: { purchase } });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Get purchase  
  static getPurchaseHistory = async (req, res) => {
    try {
      const id = req.user._id;

      const purchases = await Purchase.find({userId:id}).populate({
        path: 'planId',
        select: 'order _id' 
    }).sort({createdAt:-1});
      sendSucces(res, { status: 200, data: { purchases  } });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Delete purchase  
  static delete = async (req, res) => {
    try {
      const id = req.params.id;

      await Purchase.findByIdAndDelete(id);
      sendSucces(res, { status: 204 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Edit purchase  
  static edit = async (req, res) => {
    try {
      const id = req.params.id;

      const { userId, amount, planId } = req.body;

      const purchase = await Purchase.findByIdAndUpdate(
        id,
        {
          userId,
          amount,
          planId,
        },
        { new: true, runValidators: true }
      );
      sendSucces(res, { data: { purchase }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };
}
module.exports = PurchaseControllers;
