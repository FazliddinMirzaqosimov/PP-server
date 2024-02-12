const { sendError, sendSucces } = require("../utils/senData");
const { passwordValidator } = require("../utils/validators/passwordValidator");
const APIFeatures = require("../utils/apiFeatures");
const Plan = require("../models/planModel");

class PlanControllers {
  // Get all plan list
  static getAll = async (req, res) => {
    try {
      const plansQuery = new APIFeatures(Plan.find(), req.query)
        .sort("prices")
        .filter()
        .paginate()
        .limitFields();

      const plans = await plansQuery.query;

      sendSucces(res, {
        data: {
          meta: {
            result: plans.length,
            page: plansQuery.page,
            limit: plansQuery.limit,
          },
          plans,
        },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Create plan
  static create = async (req, res) => {
    try {
      const { duration, description, price, title, image, advantages } =
        req.body;

      const plan = await Plan.create({
        description,
        price,
        title,
        duration,
        image,
        advantages,
      });
      sendSucces(res, { data: { plan }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Get plan
  static get = async (req, res) => {
    try {
      const id = req.params.id;

      const plan = await Plan.findById(id);
      sendSucces(res, { status: 200, data: { plan } });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Delete plan
  static delete = async (req, res) => {
    try {
      const id = req.params.id;

      await Plan.findByIdAndDelete(id);
      sendSucces(res, { status: 204 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Edit plan
  static edit = async (req, res) => {
    try {
      const id = req.params.id;

      const { duration, description, price, title, image, advantages, order } =
        req.body;

      const plan = await Plan.findByIdAndUpdate(
        id,
        { duration, description, price, title, image, advantages, order },
        { new: true, runValidators: true }
      );
      sendSucces(res, { data: { plan }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };
}
module.exports = PlanControllers;
