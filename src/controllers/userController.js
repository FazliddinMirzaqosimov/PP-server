const User = require("../models/userModel");
const { sendError, sendSucces } = require("../utils/senData");
const { passwordValidator } = require("../utils/validators/passwordValidator");
const APIFeatures = require("../utils/apiFeatures");
const Purchase = require("../models/purchaseModel");

class UserControllers {
  // Get all user list
  static getAll = async (req, res) => {
    try {
      const usersQuery = new APIFeatures(User.find(), req.query)
        .sort()
        .filter()
        .paginate()
        .limitFields();

      const users = await usersQuery.query;
      sendSucces(res, {
        data: {
          meta: {
            result: users.length,
            page: usersQuery.page,
            limit: usersQuery.limit,
          },
          users,
        },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Create admin from superadmin
  static create = async (req, res) => {
    try {
      const { email, password, role } = req.body;

      const { isValid, message } = passwordValidator(password);
      if (!isValid) {
        return sendError(res, { error: message, status: 422 });
      }
      const user = await User.create({ email, role });
      sendSucces(res, { data: { user }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Edit users from superadmin
  static edit = async (req, res) => {
    try {
      const id = req.params.id;

      const { email, role } = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { email, role },
        { new: true, runValidators: true }
      );

      sendSucces(res, { data: { user }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Delete user from superadmin
  static delete = async (req, res) => {
    try {
      const id = req.params.id;

      await User.findByIdAndDelete(id);
      sendSucces(res, { status: 204 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Get one user
  static get = async (req, res) => {
    try {
      const id = req.params.id;

      const user = await User.findById(id);
      sendSucces(res, { status: 200, data: { user } });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  static getBalance = async (req, res) => {
    try {
      const userId = req.user._id;
      const balance = await Purchase.aggregate([
        {
          $match: {
            userId: userId,
          },
        },
        {
          $group: {
            _id: null,
            balance: { $sum: "$amount" },
          },
        },
      ]);
      
 
      sendSucces(res, { status: 200, data: { balance } });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };
}

module.exports = UserControllers;
