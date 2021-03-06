const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const Authrouter = require("./src/auth/auth.router");
const UserRouter = require("./src/user/user.router");

const PORT = process.env.PORT || 8080;

dotenv.config();

start();

function start() {
  const app = initServer();
  connectMiddlewares(app);
  declarateRouters(app);
  connectToDb();
  listen(app);
}
function initServer() {
  return express();
}
function connectMiddlewares(app) {
  app.use(express.json());
  app.use(cors());
  app.use("/images", express.static("public/images/"));
}

function declarateRouters(app) {
  app.use("/user", UserRouter);
  app.use("/auth", Authrouter);
}

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
function listen(app) {
  app.listen(PORT, () => {
    console.log("Server is lisening on port", PORT);
  });
}
