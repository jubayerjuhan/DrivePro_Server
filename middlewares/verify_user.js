import { userModel } from "../models/user_model.js";
import jwt from "jsonwebtoken";
import Errorhandler from "./handle_error.js";
import { Instructor } from "../models/instructor_model.js";
import { adminModal } from "../models/admin_model.js";

export const verifyUser = async (req, res, next) => {
  // getting the token from auth header
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(new Errorhandler(404, "No jwt token found"));

  const token = authHeader.split(" ")[1];
  // if there is404, no token
  if (!token) return next(new Errorhandler(404, "No jwt token found"));

  // verify token
  jwt.verify(token, process.env.JWT_SECRET, async (err, res) => {
    if (err) return next(new Errorhandler(403, "Invalid Jwt Token"));

    // getting user from the req token and sendting it to the next middleware
    const user = await userModel.findById(res.id);
    const instructor = await Instructor.findById(res.id);
    if (!user && !instructor)
      return next(new Errorhandler(404, "User not found"));

    req.user = user || instructor;
    next();
  });
};
export const verifyInstructor = async (req, res, next) => {
  // getting the token from auth header
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(new Errorhandler(404, "No jwt token found"));

  const token = authHeader.split(" ")[1];
  // if there is404, no token
  if (!token) return next(new Errorhandler(404, "No jwt token found"));

  // verify token
  jwt.verify(token, process.env.JWT_SECRET, async (err, res) => {
    if (err) return next(new Errorhandler(403, "Invalid Jwt Token"));

    // getting user from the req token and sendting it to the next middleware
    const instructor = await Instructor.findById(res.id);
    if (!instructor)
      return next(
        new Errorhandler(404, "Instructor not found, You Are Not A Instructor")
      );

    if (instructor.userType !== "instructor")
      return next(new Errorhandler(403, "You Are Not A Instructor"));

    req.user = instructor;
    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  // getting the token from auth header
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(new Errorhandler(404, "No jwt token found"));

  const token = authHeader.split(" ")[1];
  // if there is404, no token
  if (!token) return next(new Errorhandler(404, "No jwt token found"));

  jwt.verify(token, process.env.JWT_SECRET, async (err, res) => {
    if (err) return next(new Errorhandler(403, "Invalid Jwt Token"));

    // getting user from the req token and sendting it to the next middleware
    const admin = await adminModal.findById(res.id);
    if (!admin)
      return next(
        new Errorhandler(404, "admin not found, You Are Not A admin")
      );

    req.user = admin;
    next();
  });
};
