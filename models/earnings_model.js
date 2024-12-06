import mongoose from "mongoose";

const EarningSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
      required: true,
    },

    bookingType: {
      type: String,
      required: true,
    },

    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    bookingAmount: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    managementFee: {
      type: Number,
      required: true,
    },
    inclusiveGst: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    paid: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    invoice: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const EarningModel = mongoose.model("earning", EarningSchema);

export default EarningModel;
