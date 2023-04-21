const CONNECTION_STATUS = {
  connected: "CONNECTED",
  disconnected: "DISCONNECTED",
};
const CONNECTION_STATUS_BACKEND = {
  connected: "BACKEND_CONNECTED",
  disconnected: "BACKEND_DISCONNECTED",
};
const CONNECTION_STATUS_DRONE = {
  connected: "DRONE_CONNECTED",
  disconnected: "DRONE_DISCONNECTED",
};
const DRONE_FLYING_STATE = {
  landed: "LANDED",
  flying: "FLYING",
};
const GESTURE = {
  thumbsUp: "thumbs_up",
  thumbsDown: "thumbs_down",
  victory: "victory",
};

const DRONE_COMMANDS = {
  takeOff: "takeoff",
  land: "land",
  emergency: "emergency",
  backFlip: "flip b",
  frontFlip: "flip f",
  hovering: "command",
};

export {
  CONNECTION_STATUS_DRONE,
  CONNECTION_STATUS_BACKEND,
  CONNECTION_STATUS,
  DRONE_FLYING_STATE,
  GESTURE,
  DRONE_COMMANDS,
};
