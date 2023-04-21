import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { mainListItems } from "./listItems";
import Video from "./Video";
import DroneControlButtons from "./DroneControlButtons";
import Status from "./Status";
import { CONNECTION_STATUS, DRONE_FLYING_STATE } from "../utils/constants";
import { disconnectSocket } from "../utils/socket";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © Drone Commander "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    maxWidth: "1440px",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeightSmallPaper: {
    height: 240,
  },
  fixedHeightBigPaper: {
    height: 510,
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [droneConnectionStatus, setDroneConnectionStatus] = React.useState(CONNECTION_STATUS.disconnected);
  const [backendConnectionStatus, setBackendConnectionStatus] = React.useState(CONNECTION_STATUS.disconnected);
  const [detectedGesture, setDetectedGesture] = useState("no gesture");
  const [handPoseModelStatus, setHandPoseModelStatus] = useState("loading...");
  const [droneFlyingState, setDroneFlyingState] = useState({
    state: DRONE_FLYING_STATE.landed,
    lastCommand: null,
  });
  const [droneState, setDroneState] = useState({
    h: 0,
    bat: 0,
  });
  const [gestureDetectionActive, setGestureDetectionActive] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    return disconnectSocket;
  }, []);
  const fixedHeightBigPaper = clsx(classes.paper, classes.fixedHeightBigPaper);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Drone Cockpit
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container className={classes.container}>
          <Grid container direction="row" justify="center" alignItems="center" spacing={3}>
            <Grid item xs={3}>
              <Grid container direction="column" spacing={3}>
                <Grid item xs={12}>
                  <Paper className={fixedHeightBigPaper}>
                    <DroneControlButtons
                      detectedGesture={detectedGesture}
                      droneConnectionStatus={droneConnectionStatus}
                      setDroneConnectionStatus={setDroneConnectionStatus}
                      backendConnectionStatus={backendConnectionStatus}
                      setBackendConnectionStatus={setBackendConnectionStatus}
                      setDroneState={setDroneState}
                      setDroneFlyingState={setDroneFlyingState}
                      gestureDetectionActive={gestureDetectionActive}
                      setGestureDetectionActive={setGestureDetectionActive}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Paper className={fixedHeightBigPaper}>
                <Video
                  setDetectedGesture={setDetectedGesture}
                  setDroneConnectionStatus={setDroneConnectionStatus}
                  setHandPoseModelStatus={setHandPoseModelStatus}
                  setGestureDetectionActive={setGestureDetectionActive}
                  setDroneFlyingState={setDroneFlyingState}
                />
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Grid container direction="column" spacing={3}>
                <Grid item xs={12}>
                  <Paper className={fixedHeightBigPaper}>
                    <Status
                      handPoseModelStatus={handPoseModelStatus}
                      droneState={droneState}
                      droneFlyingState={droneFlyingState.state}
                      droneConnectionStatus={droneConnectionStatus}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}
