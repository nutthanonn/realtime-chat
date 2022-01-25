const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.PORT || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connect");

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User ID: ${socket.id} join room: ${data}`);
  });

  // socket.on("receive_message", (data) => {});

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(8000, () => {
  console.log("Success");
});
