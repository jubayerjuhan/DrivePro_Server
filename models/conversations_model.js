import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
  conversations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  ],
});

export const conversations = mongoose.model("conversation", conversationSchema);
