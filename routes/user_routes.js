import { Router } from "express";
import {
  loginUser,
  registerUser,
  forgetPassword,
  resetPassword,
  addCredit,
  getCurrentUser,
  editUser,
  updateProfilePic,
  uploadFilesToServer,
} from "../controllers/user_controller.js";
import { multerProcess } from "../utils/multer.js";
import { verifyUser } from "../middlewares/verify_user.js";
import { getSingleUser } from "../controllers/Admin/admin_user.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/user/:id").post(getSingleUser);
router.route("/me").get(verifyUser, getCurrentUser);
router.route("/edit-user").put(verifyUser, editUser);
router
  .route("/update-avater")
  .put(verifyUser, multerProcess.single("avater"), updateProfilePic);
router.route("/forgot-password").post(forgetPassword);
router.route("/reset-password").post(resetPassword);
router.route("/add-credit").post(verifyUser, addCredit);
router
  .route("/upload-files")
  .post(multerProcess.single("avater"), uploadFilesToServer);
export default router;
