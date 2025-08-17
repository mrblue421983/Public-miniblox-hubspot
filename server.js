const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const sessions = {};

app.use(express.static(__dirname));

app.get("/healthz", (req, res) => {
  res.sendStatus(200);
});

app.get("/join/:sessionId", (req, res) => {
  const sessionId = req.params.sessionId;
  if (!sessions[sessionId]) sessions[sessionId] = [];
  if (sessions[sessionId].length >= 2) return res.status(403).send("Session full");
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  let sessionId;

  socket.on("join", (playerId) => {
    sessionId = socket.handshake.headers.referer.split("/join/")[1];
    if (!sessionId) return;

    if (!sessions[sessionId]) sessions[sessionId] = [];
    sessions[sessionId].
