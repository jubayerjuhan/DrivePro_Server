import mongoose from "mongoose";

const fortNightlyPaymentSchema = mongoose.Schema(
  {
    bookingAmount: { type: Number, required: true },
    total: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    managementFee: { type: Number, required: true },
    gst: { type: Number, required: true },
    inclusiveGst: { type: Number, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    invoice: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const FortnightlyPaymentModel = mongoose.model(
  "FortnightlyPayment",
  fortNightlyPaymentSchema
);
