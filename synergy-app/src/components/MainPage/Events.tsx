import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import EventIcon from "@mui/icons-material/Event";
import Title from "./Title";
import { useEffect } from "react";
import { getUserSyncData } from "../getFunctions";
import { auth } from "../../config/firebase";
import moment from "moment";

export default function Events() {
  const userID = auth.currentUser?.uid;
  const [events, setEvents] = React.useState([]);

  const convertToJSDate = (date: any, time: any) => {
    return moment(`${date}T${time}`).toDate();
  };

  useEffect(() => {
    (async () => {
      try {
        const reqUserData = await getUserSyncData(userID);
        const reqDbEvents = reqUserData.eventID;
        const eventArray: any = [];
        Object.entries(reqDbEvents).forEach(([key, value]) => {
          eventArray.push({
            date: value.eventDate,
            time: value.eventSTime,
            title: value.eventTitle,
          });
        });
        // console.log(eventArray);
        // setNoOfEvents(eventArray.length);
        setEvents(eventArray);
        console.log(eventArray);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <React.Fragment>
      <Title>Upcoming Events</Title>
      <div style={{ width: "100%", flexGrow: 1, overflow: "hidden" }}>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {events.map((value) => (
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: "#EE964B" }}>
                  <EventIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={value.title}
                secondary={value.date + ", " + value.time}
              />
            </ListItem>
          ))}
          {/* <ListItem>
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
          </ListItem> */}
        </List>
      </div>
    </React.Fragment>
  );
}
