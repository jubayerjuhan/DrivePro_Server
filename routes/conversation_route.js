import { Router } from "express";
import {
  addMessage,
  addNewConversation,
  createConversation,
  getConversation,
  getConvoMessage,
} from "../controllers/conversation_controller.js";

const router = Router();

router.route("/create-conversation").post(createConversation);
router.route("/add-conversation").post(addNewConversation);
router.route("/add-message").post(addMessage);
router.route("/get-messages/:id").get(getConvoMessage);
router.route("/get-conversations").get(getConversation);

export default router;
