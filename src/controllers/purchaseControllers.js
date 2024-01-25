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
      const purchasesQuery = new APIFeatures(Purchase.find(), req.query)
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

  // Create purchase section list
  static create = async (req, res) => {
    try {
      const { email, amount, planId } = req.body;

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
      }  if (user.role !== "user") {
        return sendError(res, {
          error: "You can purchase only to users!",
          status: 404,
        });
      }

      const plan = await Plan.findById(planId);
      if (!plan) {
        return sendError(res, { error: "Plan not found!", status: 404 });
      }
      const latestPurchase = await Purchase.findOne({ userId: user._id })
        .sort({ createdAt: -1 })
        .populate("planId");

      if (latestPurchase) {
        const latestPlanDuration =
          latestPurchase.planId.duration * 24 * 60 * 60 * 1000;
        const latestPlanStartDate = latestPurchase.createdAt.getTime();
        const currentTime = new Date().getTime();
        const expiresIn = new Date(latestPlanStartDate + latestPlanDuration);

        if (expiresIn.getTime() > currentTime) {
          return sendError(res, {
            error: `Users' current plan will expire in "${expiresIn}" !`,
            status: 404,
          });
        }
      }

      const purchase = await Purchase.create({
        userId: user._id,
        amount,
        planId,
      });

      sendSucces(res, { data: { purchase }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Get purchase section list
  static get = async (req, res) => {
    try {
      const id = req.params.id;

      const purchase = await Purchase.findById(id);
      sendSucces(res, { status: 200, data: { purchase } });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Delete purchase section list
  static delete = async (req, res) => {
    try {
      const id = req.params.id;

      await Purchase.findByIdAndDelete(id);
      sendSucces(res, { status: 204 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Edit purchase section list
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