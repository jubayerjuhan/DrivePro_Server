import catchAsyncError from "../middlewares/catchAsyncError.js";
import Errorhandler from "../middlewares/handle_error.js";
import { conversations } from "../models/conversations_model.js";
import { messages } from "../models/message_model.js";
import { userModel } from "../models/user_model.js";
import { Instructor } from "../models/instructor_model.js";

export const createConversation = catchAsyncError(async (req, res, next) => {
  const convos = await conversations.create({
    conversations: ["639770a565124e8a5afb0a4e"],
  });
  res.status(200).json({
    success: true,
    convos,
  });
});

export const addNewConversation = catchAsyncError(async (req, res, next) => {
  const { currentConvo } = req.body;
  const user = await userModel.findById(currentConvo);
  const instructor = await Instructor.findById(currentConvo);

  const allChats = await conversations.find();
  const convo = allChats[0];

  const withoutCurrentConvo = convo.conversations?.filter(
    (elem) =>
      elem.toString() !== (instructor?._id.toString() || user?._id.toString())
  );

  withoutCurrentConvo.splice(0, 0, user._id || instructor._id);

  const chatList = await conversations.findByIdAndUpdate(
    "6397714d2f2767729e145f1e",
    { conversations: withoutCurrentConvo }
  );

  res.status(200).json({
    success: true,
    chatList,
  });
});

export const addMessage = catchAsyncError(async (req, res, next) => {
  const message = await messages.create(req.body);
  res.status(200).json({
    success: true,
    message,
  });
});

export const getConvoMessage = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!id) return next(new Errorhandler(404, "Id Not Found"));
  const user = await userModel.findById(id);

  if (!user) return next(new Errorhandler(403, "No User With This Id"));
  const allMessages = await messages
    .find()
    .or([{ from: { $regex: user?._id } }, { to: { $regex: user?._id } }]);
  res.status(200).json({
    success: true,
    messages: allMessages,
  });
});

export const getConversation = catchAsyncError(async (req, res, next) => {
  const convo = await conversations.find({}).populate("conversations");
  const convos = convo[0]["conversations"];

  res.status(200).json({
    success: true,

    conversations: convos,
  });
});
