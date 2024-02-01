const User = require("../models/userModel");
const { sendError, sendSucces } = require("../utils/senData");
const { passwordValidator } = require("../utils/validators/passwordValidator");
const APIFeatures = require("../utils/apiFeatures");
const Purchase = require("../models/purchaseModel");
const Course = require("../models/courseModel");
const Plan = require("../models/planModel");
const { getUserBalance } = require("../utils/getBalance");

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

      const { fullName,role } = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { fullName,role },
        { new: true, runValidators: true }
      );

      sendSucces(res, { data: { user }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  }; // Edit profile

  static editProfile = async (req, res) => {
    try {
      const id = req.user._id;

      const { fullName } = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { fullName },
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

  //get profile of user
  static getProfile = async (req, res) => {
    try {
      const user = req.user;
      const balance = await getUserBalance(user._id);
      const lastPurchase = await Purchase.findOne({
        userId: user._id,
        amount: { $gt: 0 },
      }).sort({ createdAt: -1 });
      sendSucces(res, {
        status: 200,
        data: {
          user: {
            email: user.email,
            role: user.role,
            verifiedAt: user.verifiedAt,
          },
          balance,
          lastPurchase,
        },
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  //get balance of profile
  static getBalance = async (req, res) => {
    try {
      const userId = req.user._id;
      const balance = await getUserBalance(userId);
      sendSucces(res, {
        status: 200,
        data: { balance },
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // buy new plan
  static buyPlan = async (req, res) => {
    try {
      const planId = req.query.planId;
      const user = req.user;

      const plan = await Plan.findById(planId);
      if (!plan) {
        return sendError(res, { error: "Plan not found!", status: 404 });
      }

      const balance = await getUserBalance(user._id);

      if (balance < plan.price) {
        return sendError(res, {
          error: "Your balance is insufficient!",
          status: 404,
        });
      }

      const latestPurchase = await Purchase.findOne({
        userId: user._id,
        amount: { $lt: 0 },
      })
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
        amount: -plan.price,
        planTitle: plan.title,
        planDuration: plan.duration,
        planId: plan._id,
      });

      sendSucces(res, {
        data: { user, plan, latestPurchase, purchase },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // add course to user
  static addCourse = async (req, res) => {
    try {
      const courseId = req.query.courseId;

      if (!courseId) {
        return sendError(res, {
          error: "courseId query not found!",
          status: 404,
        });
      }

      const course = await Course.findById(courseId);
      if (!course) {
        return sendError(res, { error: "Course not found!", status: 404 });
      }
      if (req.user.startedCourses.includes(course._id)) {
        return sendError(res, {
          error: "You already have this course!",
          status: 404,
        });
      }

      await req.user.updateOne(
        { $push: { startedCourses: courseId } },
        { new: true }
      );

      sendSucces(res, { data: "Course successfully added!", status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // remove course to user
  static removeCourse = async (req, res) => {
    try {
      const courseId = req.query.courseId;

      if (!courseId) {
        return sendError(res, {
          error: "courseId query not found!",
          status: 404,
        });
      }

      const course = await Course.findById(courseId);
      if (!course) {
        return sendError(res, { error: "Course not found!", status: 404 });
      }
      if (!req.user.startedCourses.includes(course._id)) {
        return sendError(res, {
          error: "You dont have this course!",
          status: 404,
        });
      }

      await req.user.updateOne({ $pull: { startedCourses: courseId } });

      sendSucces(res, { data: "Course successfully removed", status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };
}

module.exports = UserControllers;
