import React from "react";
import Title from "./Title";
import { Box, Button, LinearProgress, Typography } from "@material-ui/core";
import { emergency } from "../utils/droneControl";
import { makeStyles } from "@material-ui/core/styles";
import { CONNECTION_STATUS } from "../utils/constants";

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
  buttonCenter: {
    marginRight: "auto",
    marginLeft: "auto",
    display: "block",
    marginTop: "10px",
    width: "180px",
  },
});

export default function Status({ handPoseModelStatus, droneState, droneFlyingState, droneConnectionStatus }) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div className={classes.depositContext}>
        <Title>Status</Title>
        <p>Handpose Model: {handPoseModelStatus}</p>
        <p>Battery</p>
        <Box display="flex" alignItems="center">
          <Box width="100%" mr={1}>
            <LinearProgress variant="determinate" value={Number(droneState.bat)} />
          </Box>
          <Box minWidth={35}>
            <Typography variant="body2" color="textSecondary">{`${Math.round(Number(droneState.bat))}%`}</Typography>
          </Box>
        </Box>
        <p>Height: {droneState.h}</p>
        <p>Flying State: {droneFlyingState}</p>
      </div>
      <Button
        disabled={droneConnectionStatus === CONNECTION_STATUS.disconnected}
        className={classes.buttonCenter}
        variant="contained"
        onClick={emergency}
      >
        Stop engine
      </Button>
    </React.Fragment>
  );
}
