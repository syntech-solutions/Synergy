import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
  IconButton,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { CenterFocusStrong } from "@mui/icons-material";

const ProfilePopup = () => {
  {
    /*useStates from existing Profile Page*/
  }
  const [name, setName] = useState("Jane Doe");
  const [username, setUsername] = useState("janedoe");
  const [email, setEmail] = useState("user@email.com");
  const [about, setAbout] = useState("About me");
  const [company, setCompany] = useState("Company/School");
  const [role, setRole] = useState("Role");
  const [skills, setSkills] = useState("Your Skills");
  const [tempProfilePicture, setTempProfilePicture] = useState(null);
  const [openReport, setOpenReport] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const handleOpenReport = () => setOpenReport(true);
  const handleCloseReport = () => setOpenReport(false);
  const handleOpenProfile = () => setOpenProfile(true);
  const handleCloseProfile = () => setOpenProfile(false);

  return (
    <div>
      {/*BUTTON FOR TESTING! Please use handleOpenProfile on the View Profile Button*/}

      {/* <Button
        variant="outlined"
        style={{
          backgroundColor: "#1e394c",
          color: "#fff",
          borderColor: "#1e394c",
          marginTop: "2%",
          fontFamily: "sans-serif",
          fontWeight: "bold",
        }}
        onClick={handleOpenProfile}
      >
        View Profile
      </Button> */}
      <Dialog
        open={openProfile}
        onClose={handleCloseProfile}
        sx={{
          "& .MuiPaper-root": { color: "#1e394c" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            margin: "40px",
            width: "30vw",
          }}
        >
          <Grid container spacing={0}>
            <Grid
              item
              xs={12}
              sm={4.5}
              alignItems="center"
              justifyContent="center"
            >
              {tempProfilePicture ? (
                <Avatar
                  src={tempProfilePicture}
                  style={{ height: "8vw", width: "8vw" }}
                />
              ) : (
                <Avatar
                  alt={name}
                  style={{ height: "8vw", width: "8vw", marginBottom: "2vh" }}
                />
              )}
              <Typography variant="h6">{name}</Typography>
              <Typography variant="body1">@{username}</Typography>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Typography
                variant="h6"
                style={{ marginBottom: "5px", fontWeight: "500" }}
              >
                Personal Information
              </Typography>
              <Typography variant="body1">About: {about}</Typography>
              <Typography variant="body1" style={{ marginBottom: "1vh" }}>
                Email: {email}
              </Typography>
              <Typography variant="body1"> Organisation: {company}</Typography>
              <Typography variant="body1">Role: {role}</Typography>
              <Typography variant="body1" style={{ marginBottom: "2vh" }}>
                Skills: {skills}
              </Typography>
              <IconButton onClick={handleOpenReport} style={{ padding: "0px" }}>
                <Box
                  bgcolor="#0c2b4b"
                  color="white"
                  style={{
                    padding: "10px",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "5px",
                  }}
                >
                  <ReportProblemIcon style={{ marginRight: "6px" }} />
                  Report User
                </Box>
              </IconButton>
            </Grid>
          </Grid>
          <Dialog open={openReport} onClose={handleCloseReport}>
            <DialogTitle>{"Report Profile"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter your report details.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="report"
                label="Report Details"
                type="text"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseReport}>Cancel</Button>
              <Button onClick={handleCloseReport}>Report</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Dialog>
    </div>
  );
};

export default ProfilePopup;
