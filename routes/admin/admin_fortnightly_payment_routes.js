import express from "express";
// importing the function to get all fortnightly payments available on Db
import { AdminGetAllFortnightlyPayments } from "../../controllers/Admin/fortnightly_payment/fortnightly_payment_controller.js";
//verify admin function
import { verifyAdmin } from "../../middlewares/verify_user.js";

// creating new router instance
const router = express.Router();

// routes for admin fortnightly payments
router
  .route("/fortnightly-payment-list")
  .get(verifyAdmin, AdminGetAllFortnightlyPayments);

export default router;
