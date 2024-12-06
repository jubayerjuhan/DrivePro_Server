import mongoose from "mongoose";

const giftcardSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export const giftCardModel = mongoose.model("giftcard", giftcardSchema);
