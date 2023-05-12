import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import adminRouter from "./routers/adminRouter.js";
import userRouter from "./routers/UserRoute.js";
import superAdminRouter from "./routers/SuperAdminRouter.js";
import User from "./models/User.js";

dotenv.config();
const app = express();

app.use(bodyParser.json());

app.use("/admin", adminRouter);

app.use("/super-admin", superAdminRouter);

app.use("/users", userRouter);

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(2000, () => {
      console.log("Server started");
    });
  })
  .catch((err) => {
    console.log(err);
  });
