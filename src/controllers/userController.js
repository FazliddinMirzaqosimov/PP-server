const User = require("../models/userModel");
const { sendError, sendSucces } = require("../utils/senData");
const { passwordValidator } = require("../utils/validators/passwordValidator");
const APIFeatures = require("../utils/apiFeatures");
const Purchase = require("../models/purchaseModel");
const Course = require("../models/courseModel");
const Plan = require("../models/planModel");
const { getUserBalance } = require("../utils/getBalance");
const { FILE_URL } = require("../shared/const");
const File = require("../models/fileModel");
const { deleteFile } = require("../utils/s3/deleteFile");
const {
  hasActivePlan,
  getCurrentPlanExpireDate,
} = require("../utils/getCurrentPlanExpireDate");

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
        data: users,
        meta: {
          length: users.length,
          limit: req.query.limit || 100,
          page: req.query.page || 1,
        },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // upload profile photo
  static uploadPhoto = async (req, res) => {
    try {
      const user = req.user;
      if (user.profileImage) {
        const file = await File.findByIdAndUpdate(
          user.profileImage,
          {
            filename: req.file.key,
            size: req.file.size,
            location: req.file.location || `${FILE_URL}/${req.file.key}`,
          },
          {
            upsert: true, // Create a new document if no document is found
          }
        );

        file?.filename && deleteFile(file.filename);
      } else {
        const file = await File.create({
          filename: req.file.key,
          size: req.file.size,
          location: req.file.location || `${FILE_URL}/${req.file.key}`,
        });

        user.profileImage = file._id;
        await user.save();
      }

      sendSucces(res, {
        data: { message: "Image succassfully updated/created." },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Create user
  static create = async (req, res) => {
    try {
      const { email, password, role, phone } = req.body;
      const verifiedAt = new Date();

      const { isValid, message } = passwordValidator(password);
      if (!isValid) {
        return sendError(res, { error: message, status: 422 });
      }
      const user = await User.create({
        email,
        role,
        password,
        verifiedAt,
        phone,
      });
      sendSucces(res, { data: { user }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Edit users from superadmin
  static edit = async (req, res) => {
    try {
      const id = req.params.id;

      const { fullName, role } = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { fullName, role },
        { new: true, runValidators: true }
      );

      sendSucces(res, { data: { user }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Edit profile
  static editProfile = async (req, res) => {
    try {
      const id = req.user._id;

      const { fullName, phone } = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { fullName, phone },
        { new: true, runValidators: true }
      );

      sendSucces(res, { data: { user }, status: 200 });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // Delete user
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
      let user = req.user.profileImage
        ? await User.findById(req.user._id)
            .populate("profileImage")
            .populate({
              path: "startedCourses",
              select: "_id image", // Replace field1, field2, field3 with the actual fields you want to include
              populate: {
                path: "image",
                model: "File", // Assuming "File" is the name of the model referencing images
                select: "location -_id", // Replace field1, field2, field3 with the actual fields you want to include
              },
            })
        : req.user;

      const balance = await getUserBalance(user._id);
      const lastPurchase = await Purchase.findOne({
        userId: user._id,
        amount: { $gt: 0 },
      }).sort({ createdAt: -1 });

      let activePlan = await getCurrentPlanExpireDate(user._id);

      const planPurchase = activePlan.planPurchase;

      if (planPurchase) {
        planPurchase.planId = planPurchase.planId._id;
        planPurchase.userId = undefined;
        planPurchase.updatedAt = undefined;
        planPurchase.__v = undefined;
      } else {
        activePlan = null;
      }

      sendSucces(res, {
        status: 200,
        data: {
          userData: {
            email: user.email,
            _id: user._id,
            profileImage: user.profileImage?.location,
            startedCourses: user.startedCourses,
            phone: user.phone,
            fullName: user.fullName,
            role: user.role,
            verifiedAt: user.verifiedAt,
          },
          activePlan,
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
      const planId = req.body.planId;
      const user = req.user;

      if (!planId) {
        return sendError(res, { error: "planId is required!", status: 404 });
      }
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

      const { expirationDate } = await getCurrentPlanExpireDate(user._id);

      if (expirationDate) {
        return sendError(res, {
          error: `Users' current plan will expire in "${expirationDate}" !`,
          status: 404,
        });
      }

      const purchase = await Purchase.create({
        userId: user._id,
        amount: -plan.price,
        planTitle: plan.title,
        planDuration: plan.duration,
        planId: plan._id,
      });

      sendSucces(res, {
        data: { user, plan, purchase },
        status: 200,
      });
    } catch (error) {
      sendError(res, { error: error.message, status: 404 });
    }
  };

  // add course to user
  static addCourse = async (req, res) => {
    try {
      const courseId = req.body.courseId;

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

      await req.user.updateOne({ $push: { startedCourses: courseId } });

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
