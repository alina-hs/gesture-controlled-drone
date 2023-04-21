"use strict";

const dgram = require("dgram");
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const { throttle } = require("lodash");

const {
  CONNECTION_STATUS_BACKEND,
  START_DRONE_SDK,
  CONNECTION_STATUS_DRONE,
  DRONE_EMERGENCY_COMMAND,
} = require("./constants");
const { handleError, parseState } = require("./utils");

app.use(cors());
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

let keepAliveSenderAttached = false;
const DRONE_PORT_COMMANDS = 8889;
const DRONE_PORT_STATE = 8890;
const DRONE_IP = "192.168.10.1";

const sendDroneStartSDK = (droneCommandSocket) =>
  droneCommandSocket.send(START_DRONE_SDK, 0, START_DRONE_SDK.length, DRONE_PORT_COMMANDS, DRONE_IP, handleError);

io.on("connection", (clientSocket) => {
  const droneCommandSocket = dgram.createSocket("udp4");
  droneCommandSocket.bind(DRONE_PORT_COMMANDS);

  const droneStateSocket = dgram.createSocket("udp4");
  droneStateSocket.bind(DRONE_PORT_STATE);

  sendDroneStartSDK(droneCommandSocket);
  console.log("client connected");
  clientSocket.on("command", (command) => {
    console.log("command sent from browser");
    console.log(command);
    droneCommandSocket.send(command, 0, command.length, DRONE_PORT_COMMANDS, DRONE_IP, handleError);
  });
  clientSocket.emit("status", CONNECTION_STATUS_BACKEND.connected);
  let interval;
  if (!keepAliveSenderAttached) {
    keepAliveSenderAttached = true;
    interval = setInterval(() => sendDroneStartSDK(droneCommandSocket), 10000);
  }
  clientSocket.on("disconnect", () => {
    clientSocket.disconnect(true);
    keepAliveSenderAttached = false;
    droneCommandSocket.close();
    droneStateSocket.close();
    console.log("client disconnected");
    clearInterval(interval);
  });
  droneStateSocket.on(
    "message",
    throttle((state) => {
      const formattedState = parseState(state.toString());
      clientSocket.emit("dronestate", formattedState);
    }, 100)
  );

  droneCommandSocket.on("message", (message) => {
    const messageDecoded = message.toString();
    console.log(`✈️ : ${messageDecoded}`);
    clientSocket.emit("status", messageDecoded === "ok" ? CONNECTION_STATUS_DRONE.connected : messageDecoded);
  });
});

http.listen(8080, () => {
  console.log("Drone Proxy is up and running");
});

process.on("SIGINT", () => {
  try {
    console.log("Received SIGINT. Drone emergency executed.");
    droneCommandSocket.send(
      DRONE_EMERGENCY_COMMAND,
      0,
      DRONE_EMERGENCY_COMMAND.length,
      DRONE_PORT_COMMANDS,
      DRONE_IP,
      handleError
    );
    droneCommandSocket.disconnect();
  } catch (err) {
  } finally {
    setTimeout(() => process.exit(2), 2000);
  }
});
