import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import { Button, FormControlLabel, Grid, Switch } from "@material-ui/core";
import { getSocket, disconnectSocket, droneStateListener, getSocketDisconnecting } from "../utils/socket";
import { CONNECTION_STATUS, CONNECTION_STATUS_DRONE, CONNECTION_STATUS_BACKEND } from "../utils/constants";
import { land, takeOff, backFlip, frontFlip } from "../utils/droneControl";

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
  buttonCenter: {
    marginRight: "auto",
    marginLeft: "auto",
    display: "block",
    marginTop: "10px",
    width: "120px",
  },
  displayFlex: {
    display: "flex",
    justifyContent: "center",
  },
});

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

export default function DroneControlButtons({
  detectedGesture,
  droneConnectionStatus,
  setDroneConnectionStatus,
  backendConnectionStatus,
  setBackendConnectionStatus,
  setDroneState,
  setDroneFlyingState,
  gestureDetectionActive,
  setGestureDetectionActive,
}) {
  const connectToDrone = () => {
    const socket = getSocket();
    socket.on("status", (message) => {
      if (getSocketDisconnecting()) {
        return;
      }
      switch (message) {
        case CONNECTION_STATUS_BACKEND.connected:
          setBackendConnectionStatus(CONNECTION_STATUS.connected);
          break;
        case CONNECTION_STATUS_DRONE.connected:
          setBackendConnectionStatus(CONNECTION_STATUS.connected);
          setDroneConnectionStatus(CONNECTION_STATUS.connected);
          droneStateListener(setDroneState, setDroneFlyingState, setBackendConnectionStatus, setDroneConnectionStatus);
          break;
        default:
          break;
      }
    });
  };

  const disconnectFromDrone = () => {
    disconnectSocket();
    setDroneConnectionStatus(CONNECTION_STATUS.disconnected);
    setBackendConnectionStatus(CONNECTION_STATUS.disconnected);
  };

  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Control Panel</Title>
      <Typography component="div" className={classes.displayFlex}>
        <FormControlLabel
          control={
            <Grid component="label" container justify="center" alignItems="center" spacing={1}>
              <Grid item>Off</Grid>
              <Grid item>
                <AntSwitch
                  checked={gestureDetectionActive}
                  onChange={({ target: { checked } }) => setGestureDetectionActive(checked)}
                />
              </Grid>
              <Grid item>On</Grid>
            </Grid>
          }
          label="Gesture Detection"
          labelPlacement="top"
        />
      </Typography>
      <p>Detected gesture: {detectedGesture}</p>
      <div className={classes.depositContext}>
        <Typography component="div" className={classes.displayFlex}>
          <FormControlLabel
            control={
              <Grid component="label" container justify="center" alignItems="center" spacing={1}>
                <Grid item>Off</Grid>
                <Grid item>
                  <AntSwitch
                    checked={backendConnectionStatus === CONNECTION_STATUS.connected}
                    onChange={({ target: { checked } }) => (checked ? connectToDrone() : disconnectFromDrone())}
                  />
                </Grid>
                <Grid item>On</Grid>
              </Grid>
            }
            label="Drone Connection"
            labelPlacement="top"
          />
        </Typography>
        <p>Backend: {backendConnectionStatus}</p>
        <p>Drone: {droneConnectionStatus}</p>
        <Button
          disabled={droneConnectionStatus === CONNECTION_STATUS.disconnected}
          className={classes.buttonCenter}
          variant="contained"
          onClick={takeOff}
          color="primary"
        >
          Takeoff
        </Button>
        <Button
          disabled={droneConnectionStatus === CONNECTION_STATUS.disconnected}
          className={classes.buttonCenter}
          variant="contained"
          onClick={land}
          color="primary"
        >
          Land
        </Button>
        <Button
          disabled={droneConnectionStatus === CONNECTION_STATUS.disconnected}
          className={classes.buttonCenter}
          variant="contained"
          onClick={backFlip}
          color="primary"
        >
          Backflip
        </Button>
        <Button
          disabled={droneConnectionStatus === CONNECTION_STATUS.disconnected}
          className={classes.buttonCenter}
          variant="contained"
          onClick={frontFlip}
          color="primary"
        >
          Frontflip
        </Button>
      </div>
    </React.Fragment>
  );
}
