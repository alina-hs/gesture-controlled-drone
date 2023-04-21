import { getSocket } from "./socket";
import { GESTURE, DRONE_FLYING_STATE, DRONE_COMMANDS } from "./constants";

let blockedForNewCommands = false;

const _sendCommand = (command) => {
  console.log("drone control: %s", command);
  const socket = getSocket();
  socket.emit("command", command);
};

const controlDroneBasedOnGesture = (gesture, { state, lastCommand }) => {
  if (blockedForNewCommands) {
    return { state, lastCommand };
  }
  switch (gesture) {
    case GESTURE.thumbsUp:
      if (state === DRONE_FLYING_STATE.landed) {
        takeOff();
        _blockForNewCommands();
        return { state, lastCommand: GESTURE.thumbsUp };
      }
      break;
    case GESTURE.thumbsDown:
      if (state === DRONE_FLYING_STATE.flying) {
        land();
        _blockForNewCommands();
        return { state, lastCommand: GESTURE.thumbsDown };
      }
      break;
    // case GESTURE.victory:
    //   if (state === DRONE_FLYING_STATE.flying) {
    //     backFlip();
    //     _blockForNewCommands();
    //     return { state, lastCommand: GESTURE.victory };
    //   }
    //   break;
    default:
      break;
  }
  return { state, lastCommand };
};

const _blockForNewCommands = () => {
  blockedForNewCommands = true;
  setTimeout(() => {
    blockedForNewCommands = false;
  }, 5000);
};

const takeOff = () => {
  _sendCommand(DRONE_COMMANDS.takeOff);
};

const land = () => {
  _sendCommand(DRONE_COMMANDS.land);
};

const emergency = () => {
  _sendCommand(DRONE_COMMANDS.emergency);
};

const backFlip = () => {
  _sendCommand(DRONE_COMMANDS.backFlip);
};

const frontFlip = () => {
  _sendCommand(DRONE_COMMANDS.frontFlip);
};

export { controlDroneBasedOnGesture, land, takeOff, backFlip, frontFlip, emergency };
