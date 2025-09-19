import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import routes from "./handlers/index.js"; //day6
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { errorHandler } from "./middlewares/errorHanlder.js";
import { initChatSocket } from "./sockets/chat.js";
import cors from "cors";

dotenv.config(); //it reads the .env file

const app = express();
const PORT = process.env.PORT;

// Create HTTP server instead of app.listen directly
const server = http.createServer(app);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); //day 6 To parse JSON body from request
app.use(authMiddleware);
app.use("/", routes); //day 6  Use your routers from handlers folder
app.use(errorHandler);

// app.get("/", (req, res) => {
//   res.send("Hello Nodejs ,This is the first code in the node js");
// });
//this was for testingpurpose in browser

// ✅ Initialize Socket.IO with the server
initChatSocket(server);

app.listen(PORT, () => {
  // console.log(`Server running in port ${process.env.PORT}`);
  console.log(`🚀 API + Socket.IO running on http://localhost:${PORT}`);
});
