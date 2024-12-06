import express from "express";
// importing the controller functions from fortnightly_payment_controller.js
import {
  getFinancialReports,
  instructorAllFortnightlyPayments,
} from "../controllers/Admin/fortnightly_payment/fortnightly_payment_controller.js";

// creating router instance
const router = express.Router();

// routes
router.route("/list").get(instructorAllFortnightlyPayments);

// instructor fortnightly payment route
router.route("/financial-reporting").post(getFinancialReports);

export default router;
