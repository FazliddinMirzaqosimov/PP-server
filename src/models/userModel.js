const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const validate = require("mongoose-validator");
const { ROLES } = require("../shared/const");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
      validate: [
        validate({
          validator: "isEmail",
          message: "Invalid email address",
        }),
      ],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ROLES,
      default: "user",
    },
    password: {
      type: String,
      select: false,
      required: [true, "Password is required"],
    },
    verifiedAt: {
      type: Date,
    },
    verificationCode: { type: String },
    passwordChangedAt: { type: Date, select: false },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    this.passwordChangedAt = new Date();
    return next();
  }
  console.log(this);

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  // Check if the password has been modified
  if (!this._update.password) {
    return next();
  }

  // Hash the password
  bcrypt.hash(this._update.password, 12, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    this._update.password = hashedPassword;
    next();
  });
});

userSchema.methods.comparePasswords = async function (loginPassword) {
  return await bcrypt.compare(loginPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
