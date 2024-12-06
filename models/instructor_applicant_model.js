import mongoose from "mongoose";

const instructorapplicantSchema = mongoose.Schema(
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
      required: "Email address is required",
    },
    phone: {
      type: String,
      required: true,
    },
    abnNumber: {
      type: String,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    avater: {
      type: String,
      // required: true,
    },
    bsbNumber: {
      type: String,
      required: true,
    },
    car: {
      type: String,
      required: true,
    },
    childrenCheckLicenseExpire: {
      type: Date,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    drivingLicenseExpire: {
      type: Date,
      required: true,
    },
    instructorLicenseExpire: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    languages: [
      {
        code: String,
        name: { type: String, required: true },
        nativaName: String,
      },
    ],
    licensePhotos: [{
      type: String,
      // required: true
    }],
    serviceSuburbs: [
      {
        postcode: String,
        state: {
          type: String,
          required: true,
        },
        suburb: {
          type: String,
          required: true,
        },
      },
    ],
    signature: {
      type: String,
      // required: true,
    },
    transmissionType: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

export const InstructorApplicantModel = mongoose.model(
  "instructor_applicant",
  instructorapplicantSchema
);
