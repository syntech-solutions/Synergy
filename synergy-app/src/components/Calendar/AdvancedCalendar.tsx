import React, { useState } from "react";
import moment from "moment";
import Calendar from "./Calendar";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Autocomplete,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { getDocData, getUserDetails, getUserSyncData } from "../getFunctions";
import { auth, db } from "../../config/firebase";
import { useEffect } from "react";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";

const convertToJSDate = (date: any, time: any) => {
  return moment(`${date}T${time}`).toDate();
};

const userID = auth.currentUser?.uid || "";

//dummy database data, should be the same as an object from the database
// let dbEvents = {
//   event1: {
//     hostID: ["hostId1", "HostName1"],
//     inviteeID: new Map([["userId1", "userName1"]]),
//     eventTitle: "Line Manager Meeting",
//     eventDesc: "Event",
//     eventDate: "2024-02-12",
//     eventSTime: "10:00:00",
//     eventETime: "11:00:00",
//   },
//   event2: {
//     hostID: ["hostId2", "HostName2"],
//     inviteeID: new Map([["userId2", "userName2"]]),
//     eventTitle: "Finish Calendar Component",
//     eventDesc: "Task",
//     eventDate: "2024-02-18",
//     eventSTime: "14:00:00",
//     eventETime: "15:30:00",
//   },
// };

const [dbEvents, setDbEvents] = useState<any>(null);

//taking event from dbEvents and converting it to the format used in the calendar
const initialEvents = Object.values(dbEvents).map((event) => ({
  start: convertToJSDate(event.eventDate, event.eventSTime),
  end: convertToJSDate(event.eventDate, event.eventETime),
  title: event.eventTitle,
  data: {
    desc: event.eventDesc,
    description: event.eventTitle,
    hostId: event.hostID,
    inviteeId: Array.from(event.inviteeID.entries()),
    type: event.eventType,
  },
}));

const components = {
  event: (props: any) => {
    const eventType = props?.event?.data?.type;
    const start = moment(props?.event?.start).format("HH:mm");
    const end = moment(props?.event?.end).format("HH:mm");

    // based on event type, change the color and style of the event
    switch (eventType) {
      case "Task":
        return (
          <div
            style={{
              backgroundColor: "#ffb759",
              padding: "8px",
              color: "#1e394c",
              height: "100%",
              borderRadius: "5px",
              fontWeight: "300",
            }}
          >
            <div>{props.title}</div>
            {/* <div>
              {start} - {end}
            </div> */}
          </div>
        );
      case "Event":
        return (
          <div
            style={{
              backgroundColor: "#1e394c",
              padding: "8px",
              color: "white",
              height: "100%",
              borderRadius: "5px",
              fontWeight: "300",
            }}
          >
            <div>{props.title}</div>
            <div>
              {start} - {end}
            </div>
          </div>
        );
      default:
        return null;
    }
  },
};

export default function ControlCalendar() {
  const [events, setEvents] = useState(initialEvents);
  const [openAddEventOverlay, setOpenAddEventOverlay] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [newEvent, setNewEvent] = useState({
    start: moment().format("YYYY-MM-DDTHH:mm"),
    end: moment().format("YYYY-MM-DDTHH:mm"),
    title: "",
    data: {
      type: "Event",
      description: "",
    },
  });
  const [memberSearch, setMemberSearch] = useState([]);
  const [memberArray, setMemberArray] = useState<any>([]);

  const handleClickOpen = () => {
    setOpenAddEventOverlay(true);
  };

  const handleCloseAddEventOverlay = () => {
    setOpenAddEventOverlay(false);
  };

  const handleEventClick = (event: React.SetStateAction<null>) => {
    setSelectedEvent(event);
    setOpenEventDialog(true);
  };

  const handleCloseEventDialog = () => {
    setOpenEventDialog(false);
  };

  const retrieveHostId = async () => {
    //implement the database here, for now will return dummy data, matching the DB.
    // const hostDetails = getUserDetails(auth.currentUser?.uid || "");
    const reqHostDetails = {
      hostId: userID,
      hostName: userDetails.userName,
    };
    console.log(reqHostDetails);
    return reqHostDetails;
  };

  const retrieveInvitee = async () => {
    //implement database use here, for now will return dummy data, matching the DB
    return { InviteeId1: "InviteeName1", InviteeId2: "InviteeName2" };
  };

  const saveEventToDB = async (event: any) => {
    try {
      // Generate a unique event ID
      const eventId = `event${Object.keys(dbEvents).length + 1}`;

      console.log(event);

      // Convert the event to the format used in dbEvents
      const dbEvent = {
        hostDetails: event.data.hostDetails,
        inviteeDetails: event.data.inviteeDetails,
        eventTitle: event.title,
        eventDesc: event.data.description,
        eventDate: moment(event.start).format("YYYY-MM-DD"),
        eventSTime: moment(event.start).format("HH:mm:ss"),
        eventETime: moment(event.end).format("HH:mm:ss"),
        eventType: "Event",
      };
      console.log("Event saved:", dbEvent);

      const eventRef = doc(db, "userData", userID);

      try {
        await updateDoc(eventRef, {
          events: {
            [eventId]: dbEvent,
          },
        });
      } catch (e) {
        console.log(e);
      }

      // Add the event to dbEvents
      setDbEvents({ ...setDbEvents, [eventId]: dbEvent });

      console.log("Event saved:", dbEvents);

      return true;
    } catch (error) {
      console.error("Error saving event:", error);
      return false;
    }
  };

  const handleSave = async () => {
    //saving with error conditions
    if (
      !newEvent.title ||
      !newEvent.start ||
      !newEvent.end ||
      !newEvent.data.description
    ) {
      setAlertMessage("Please fill all required fields.");
      return;
    }

    const startMoment = moment(newEvent.start);
    const endMoment = moment(newEvent.end);

    // Check if the start time is at least one minute in the future
    if (startMoment.isBefore(moment().add(1, "minutes"))) {
      setAlertMessage(
        "The event start time must be at least one minute in the future."
      );
      return;
    }

    // Check if the end time is after the start time
    if (endMoment.isSameOrBefore(startMoment)) {
      setAlertMessage("The event end time must be after the start time.");
      return;
    }

    try {
      const reqUserDetails = await getUserDetails(userID);
      setUserDetails(reqUserDetails);

      // console.log(reqUserDetails);

      const inviteeArray = memberArray.map((member: any) => {
        return { inviteeID: member.memberID, inviteeName: member.userName };
      });

      const toSetEvents = {
        start: moment(newEvent.start).toDate(),
        end: moment(newEvent.end).toDate(),
        title: newEvent.title,
        data: {
          type: newEvent.data.type,
          description: newEvent.data.description,
          hostDetails: { hostID: userID, hostName: reqUserDetails.userName }, //do something with db please
          inviteeDetails: inviteeArray,
        },
      };

      console.log(memberArray);

      console.log(toSetEvents);

      setEvents([...events, toSetEvents]);
      setNewEvent({
        start: moment().format("YYYY-MM-DDTHH:mm"),
        end: moment().format("YYYY-MM-DDTHH:mm"),
        title: "",
        data: {
          // hostId: [userID, reqUserDetails.userName], //do something with db please
          type: "Event",
          description: "",
        },
      });

      console.log(events);

      console.log(newEvent);
      saveEventToDB(toSetEvents);
    } catch (err) {
      console.log(err);
    }

    setOpenAddEventOverlay(false);
  };

  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const reqUserDetails = await getUserDetails(userID);
        setUserDetails(reqUserDetails);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const memberData = await getDocData("userDetails");

        let membersName: any = [];

        memberData?.forEach((member: any) => {
          if (member.memberID !== auth.currentUser?.uid) {
            membersName.push({
              userName: member.userName,
              userEmail: member.userEmail,
              memberID: member.memberID,
            });
          }
        });

        setMemberSearch(membersName);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const reqUserData = await getUserSyncData(userID);
        setDbEvents({ ...dbEvents, ...reqUserData.events });
        console.log(dbEvents);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "94vh" }}>
      <div style={{ flex: "1 0 auto" }}>
        <Calendar
          events={dbEvents}
          components={components}
          onSelectEvent={handleEventClick}
        />
        {selectedEvent && (
          <Dialog open={openEventDialog} onClose={handleCloseEventDialog}>
            <DialogTitle>{selectedEvent.title}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Start: {selectedEvent.start.toString()}
                <br />
                End: {selectedEvent.end.toString()}
                <br />
                Description: {selectedEvent.data.description}
                <br />
                {/* Host: {selectedEvent.data.hostId}
                <br />
                Invitees: {selectedEvent.data.inviteeId} */}{" "}
                {/* do something with db please */}
              </DialogContentText>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div style={{ flexShrink: "0" }}>
        <Button
          variant="outlined"
          style={{
            backgroundColor: "#1e394c",
            color: "#fff",
            borderColor: "#1e394c",
            marginTop: "2%",
            fontFamily: "sans-serif",
            fontWeight: "bold",
          }}
          onClick={handleClickOpen}
        >
          Add Event
        </Button>
      </div>
      <Dialog // Add Event Overlay
        open={openAddEventOverlay}
        onClose={handleCloseAddEventOverlay}
        sx={{
          "& .MuiPaper-root": { color: "#1e394c" },
        }}
      >
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Event Title"
            type="text"
            fullWidth
            variant="standard"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
            required
          />
          <TextField
            margin="dense"
            id="date"
            label="Date"
            type="date"
            fullWidth
            variant="standard"
            value={newEvent.start.split("T")[0]}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                start: `${e.target.value}T${newEvent.start.split("T")[1]}`,
                end: `${e.target.value}T${newEvent.end.split("T")[1]}`,
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            margin="dense"
            id="start"
            label="Start Time"
            type="time"
            fullWidth
            variant="standard"
            value={newEvent.start.split("T")[1]}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                start: `${newEvent.start.split("T")[0]}T${e.target.value}`,
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            margin="dense"
            id="end"
            label="End Time"
            type="time"
            fullWidth
            variant="standard"
            value={newEvent.end.split("T")[1]}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                end: `${newEvent.end.split("T")[0]}T${e.target.value}`,
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={newEvent.data.description}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                data: { ...newEvent.data, description: e.target.value },
              })
            }
            required
          />
          <Autocomplete
            fullWidth={true}
            multiple
            id="tags-standard"
            // name="syncDesc"
            // type="syncDesc"
            options={memberSearch}
            getOptionLabel={(option) => option.userName}
            // defaultValue={[top100Films[13]]}
            // filterSelectedOptions
            onChange={(events, value) => setMemberArray(value)}
            renderInput={(params) => (
              <TextField
                margin="dense"
                {...params}
                variant="standard"
                label="Add Members"
                placeholder="Members"
                type="member"
              />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseAddEventOverlay}
            style={{ color: "#1e394c" }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} style={{ color: "#1e394c" }}>
            Create Event
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!alertMessage}
        autoHideDuration={6000}
        onClose={() => setAlertMessage(null)}
      >
        <Alert
          onClose={() => setAlertMessage(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
