const { sendError, sendSucces } = require("../utils/senData");
const { passwordValidator } = require("../utils/validators/passwordValidator");
const APIFeatures = require("../utils/apiFeatures");
const Purchase = require("../models/purchaseModel");

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
      const { userId, amount } = req.body;

      const purchase = await Purchase.create({
        userId,
        amount,
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

      const { userId, amount } = req.body;

      const purchase = await Purchase.findByIdAndUpdate(
        id,
        {
          userId,
          amount,
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
