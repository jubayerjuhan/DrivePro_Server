import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
  slots: [
    {
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      },
      _id: false, // disable _id field
    },
  ],
});

const closedEventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
});

const instructorSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
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
    gender: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
      required: true,
    },
    transmissionType: {
      type: String,
      required: true,
    },
    // credit: {
    //   type: Number,
    //   default: 0,
    // },
    languages: [{ type: String, required: true }],
    avater: {
      type: String,
      // required: true,
    },
    bio: {
      type: String,
    },
    reviews: [
      {
        user: { type: String },
        rating: { type: Number },
        message: { type: String },
      },
    ],
    car: {
      name: { type: String },
      numberPlate: { type: String },
      image: { type: String },
    },
    serviceSuburbs: {
      suburbs: [
        {
          name: { type: String, required: true },
          postCode: { type: String, required: true },
        },
      ],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordTime: {
      type: Date,
      select: false,
    },
    drivingLicenseExpire: {
      type: Date,
      required: true,
    },
    instructorLicenseExpire: {
      type: Date,
      required: true,
    },
    childrenCheckLicenseExpire: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    hasGst: {
      type: Boolean,
      required: true,
      enum: [true, false],
      default: false,
    },

    bankAccountNumber: {
      type: String,
      required: true,
    },
    bsbNumber: {
      type: String,
      required: true,
    },

    abnNumber: {
      type: String,
      required: true,
    },
    invoiceAddress: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      default: "instructor",
    },
    availability: [availabilitySchema],
    closedEvents: [closedEventSchema],
  },
  { timestaps: true }
);

instructorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);

  if (!this.availability || this.availability.length === 0) {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    this.availability = daysOfWeek.map((day) => ({
      day,
      slots: [
        { startTime: "", endTime: "" },
        { startTime: "6:00 AM", endTime: "10:00 PM" },
      ],
    }));
  }
  next();
});

instructorSchema.methods.generateJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_DAY,
  });
};

instructorSchema.methods.passwordComparison = async function (password) {
  const validPass = await bcrypt.compare(password, this.password);
  return validPass;
};

instructorSchema.methods.resetPasswordRequest = async function () {
  const hexString = await crypto.randomBytes(16).toString("hex");
  this.resetPasswordToken = hexString;
  this.resetPasswordTime = Date.now() + 2 * 60 * 1000;
};

export const Instructor = mongoose.model("Instructor", instructorSchema);
