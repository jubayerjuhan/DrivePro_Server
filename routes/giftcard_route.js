import { Router } from "express";
import {
  createGiftcard,
  deleteGiftcard,
  validateCoupon,
} from "../controllers/giftCardController.js";
import { verifyUser } from "../middlewares/verify_user.js";

const router = Router();

router.route("/create-giftcard").post(verifyUser, createGiftcard);
router.route("/validate-giftcard/:code").get(verifyUser, validateCoupon);
router.route("/delete-giftcard/:id").delete(verifyUser, deleteGiftcard);

export default router;
