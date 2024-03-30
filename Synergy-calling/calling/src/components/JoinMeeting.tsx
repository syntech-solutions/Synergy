import React from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import bgImage from "./joinbg.png";
import CallScreen from "./CallScreen";

const JoinMeeting = () => {
  const [name, setName] = React.useState("");
  const [meetingJoined, setMeetingJoined] = React.useState(false);
  return (
    <>
      {meetingJoined ? (
        <>
          <CallScreen callID={"2vVr6HdMKifp5b8e8b0j"} userID={name} />
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              backgroundImage: `url(${bgImage})`,
            }}
          >
            <Paper
              style={{
                padding: "50px",
                borderRadius: "8px",
                width: "30%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ marginBottom: "7%" }}
              >
                Join Meeting
              </Typography>
              <TextField
                label="Meeting ID"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: "3%" }}
              />
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: "5%" }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ backgroundColor: "#0c2c4b" }}
                onClick={() => setMeetingJoined(true)}
              >
                Join
              </Button>
            </Paper>
          </div>
        </>
      )}
    </>
  );
};

export default JoinMeeting;
