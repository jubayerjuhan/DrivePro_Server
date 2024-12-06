import mongoose from "mongoose";
const { Schema } = mongoose;

const agreementSchema = Schema({
  agreement: {
    type: String,
    required: true,
  },
});

export const agreementModel = mongoose.model("agreement", agreementSchema);
