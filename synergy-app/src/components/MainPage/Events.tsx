import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import EventIcon from "@mui/icons-material/Event";
import Title from "./Title";

export default function Events() {
  return (
    <React.Fragment>
      <Title>Upcoming Events</Title>
      <div style={{ width: "100%", flexGrow: 1, overflow: "hidden" }}>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ backgroundColor: "#EE964B" }}>
                <EventIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Foundations 2 Class"
              secondary="Today, 15:00 pm"
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ backgroundColor: "#EE964B" }}>
                <EventIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Language Processors Class"
              secondary="Tomorrow, 12:00 pm"
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ backgroundColor: "#EE964B" }}>
                <EventIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Stage 2 Deadline"
              secondary="Thursday, 17:00 pm"
            />
          </ListItem>
        </List>
      </div>
    </React.Fragment>
  );
}
