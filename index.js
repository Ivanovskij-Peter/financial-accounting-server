const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 8080;

dotenv.config();

start();

function start() {
  const app = initServer();
  connectMiddlewares(app);
  declarateRouters(app);
  connectToDb()
  listen(app)
}
function initServer() {
  return express();
}
function connectMiddlewares(app) {
  app.use(express.json());
  app.use(cors());
}

function declarateRouters(app) {
    app.use()
    app.use()
    app.use()
}


function connectToDb(){
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
function listen(app){
    app.listen(PORT,()=>{
        console.log("Server is lisening on port", PORT);
    })
}