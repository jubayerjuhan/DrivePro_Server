import mongoose from "mongoose";

const carSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

export const carModel = mongoose.model("car", carSchema);
