import { Router } from "express";
import {
  createPaymentIndent,
  getLessonPrices,
} from "../controllers/payment_controller.js";

const router = Router();

router.route("/payment-indent").post(createPaymentIndent);
router.route("/lesson-price").get(getLessonPrices);

export default router;
