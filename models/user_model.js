import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  accessability: {
    type: Boolean,
    required: true,
    default: false,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  phone: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  licenseStatus: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  credit: {
    type: Number,
    default: 0,
  },
  resetPasswordToken: {
    type: String,
    select: false,
  },
  resetPasswordTime: {
    type: Date,
    select: false,
  },
  avater: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  userType: {
    type: String,
    default: "learner",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

// reset password
userSchema.methods.resetAndHashPassword = async function (password) {
  this.password = await bcrypt.hash(password, 12);
};

// generate jwt token
userSchema.methods.generateJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_DAY,
  });
};

// compare password
userSchema.methods.passwordComparison = async function (password) {
  const validPass = await bcrypt.compare(password, this.password);
  if (!validPass) return false;
  else {
    return true;
  }
};

userSchema.methods.resetPasswordRequest = async function () {
  const hexString = await crypto.randomBytes(16).toString("hex");
  this.resetPasswordToken = hexString;
  this.resetPasswordTime = Date.now() + 2 * 60 * 1000;
};

export const userModel = mongoose.model("user", userSchema);
