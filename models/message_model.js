import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = Schema(
  {
    text: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
    },
    to: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      default: "text",
    },
  },
  { timestamps: true }
);

export const messages = mongoose.model("message", messageSchema);
