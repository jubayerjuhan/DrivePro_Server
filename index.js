// core imports
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";

// database connection function
import { connectToDatabase } from "./database/database.js";
// error catcher middleware
import { errorMiddleware } from "./middlewares/error_middleware.js";

// importing routes
import userRoutes from "./routes/user_routes.js";
import instructorApplicantRoute from "./routes/instructor_applicant_route.js";
import instructorRoute from "./routes/instructor_routes.js";
import paymentRoute from "./routes/payment_route.js";
import bookingRoute from "./routes/booking_route.js";
import adminRoute from "./routes/admin_route.js";
import adminFortnightPaymentRoute from "./routes/admin/admin_fortnightly_payment_routes.js";
import fortnightlyPaymentRoute from "./routes/fortnightly_payment_route.js";
import suburbRoute from "./routes/suburb_route.js";
import giftCardRoute from "./routes/giftcard_route.js";
import agreementRoute from "./routes/agreement_route.js";
import conversationRoute from "./routes/conversation_route.js";
import earningRoute from "./routes/earning_route.js";
import adminEarningRoute from "./routes/admin/admin_earning_route.js";

// Socket Server
import { Server } from "socket.io";

// google cloud storage
import { Storage } from "@google-cloud/storage";

// allowed origin and check origin
import { allowedorigin, checkOrigin } from "./middlewares/checkOrigin.js";

// Verifying Middleware Of Instructor
import { verifyInstructor } from "./middlewares/verify_user.js";
import moment from "moment";

// initializing app
const app = express();
// applying cors middleware

const server = http.createServer(app);

var corsOptions = {
  origin: allowedorigin,
};

app.use(cors(corsOptions));

// bodyparser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// initializing necessery variable and port
const PORT = process.env.PORT || 5000;

// connect to database
connectToDatabase();

// App Routes
// 01818958564
app.use("/api", userRoutes);
app.use("/api", instructorApplicantRoute);
app.use("/api", instructorRoute);
app.use("/api", paymentRoute);
app.use("/api", bookingRoute);
app.use(
  "/api/admin",
  adminRoute,
  adminEarningRoute,
  adminFortnightPaymentRoute
);
app.use("/api", giftCardRoute);
app.use("/api", suburbRoute);
app.use("/api/convo", conversationRoute);
app.use("/api/agreement", agreementRoute);
app.use("/api/earning", earningRoute);
app.use("/api/fortnightly-payment", verifyInstructor, fortnightlyPaymentRoute);

// image request
app.use("/uploads", express.static("./tmp"), (req, res, next) => {
  next();
});

app.use(express.static("assets"));

// home request
app.get("/", async (req, res, next) => {
  res.status(200).json({
    success: true,
    today: moment().startOf("day"),
    message: `My Instructor Server Is Up And Running.....`,
  });
});

// test request
app.post("/", async (req, res, next) => {
  // res.status(200).json({
  //   success: true,
  //   message: "My Instructor Server Is Up And Running.....",
  // });
});

// google cloud storage
export const gcloudStorage = new Storage({
  keyFilename: "./first-energy-364305-29145b74aa26.json",
  projectId: "first-energy-364305",
});

// websocket connection
// ----------------------

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let socketUsers = [];
// socket users methods
const removeUser = (socketId) => {
  const removedArray = socketUsers.filter((user) => user.socketId !== socketId);
  socketUsers = removedArray;
};

// connecting io
io.on("connection", (socket) => {
  socket.on("add_user", (data) => {
    socketUsers.push({ ...data, socketId: socket.id });
    io.emit("connected_users", socketUsers);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("connected_users", socketUsers);
  });

  socket.on("send_message_to_admin", (message) => {
    io.to(message.to).emit("recieve_message_admin", message);
  });

  socket.on("send__message", (message) => {
    io.to(message.to).emit("recieve_message_user", message);
  });
});

// ----------------------
//

// listening to server
server.listen(PORT, () =>
  console.log("Myinstructor server listening to port " + PORT + "...")
);

app.use(errorMiddleware);
