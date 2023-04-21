import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FlightIcon from "@material-ui/icons/Flight";
import SettingsIcon from "@material-ui/icons/Settings";

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <FlightIcon />
      </ListItemIcon>
      <ListItemText primary="Drone control" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Settings" />
    </ListItem>
  </div>
);
