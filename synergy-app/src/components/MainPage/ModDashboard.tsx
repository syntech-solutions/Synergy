import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button, Grid, Menu, MenuItem } from "@mui/material";
import InfoIcon from "@mui/icons-material/ReportProblem";
import Download from "@mui/icons-material/Download";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { AccountCircle } from "@mui/icons-material";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { db } from "../../config/firebase";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function ModDashboard() {
  const [data, setData] = useState(null);
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const analytics = {
    numberOfUsers: 122,
    numberOfCalls: 12,
    numberOfSyncs: 34,
    numberOfEventsHosted: 56,
    mostUsedTool: "Whiteboard",
    // Add more analytics data as needed
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openAlert, setOpenAlert] = useState(false);
  const [anchorHandle, setAnchorHandle] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [misconductList, setMisconductList] = useState({});
  const [docCount, setDocCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [callCount, setCallCount] = useState(0);
  const [syncCount, setSyncCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  const reporttoadd = [
    {
      dateReported: "March 18, 2024 at 6:45:55 PM UTC+4",
      reportCategory: "Identity Theft",
      reportDesc:
        "Someone is using my photos and personal information to impersonate me on the platform.",
      reportedBy: "ref672",
      reportedName: "Sophia Nguyen",
      userID: "sop789",
    },
    {
      dateReported: "March 19, 2024 at 2:20:10 PM UTC+4",
      reportCategory: "Violence or Threat of Violence",
      reportDesc:
        "I received a message containing threats of physical harm against me and my family.",
      reportedBy: "ref510",
      reportedName: "James Miller",
      userID: "jmiller456",
    },
    {
      dateReported: Timestamp.fromDate(new Date("March 26, 2024 16:30:15")),
      reportCategory: "Other",
      reportDesc:
        "I encountered inappropriate content that doesn't fit into any other category.",
      reportedBy: "ref932",
      reportedName: "Sarah Lee",
      userID: "slee789",
    },
  ];

  const handleClickReport = (event, index) => {
    setAnchorHandle(event.currentTarget);
    setSelectedIndex(index);
  };
  const handleCloseHandle = () => {
    setAnchorHandle(null);
  };

  useEffect(() => {
    // const misconductRef = collection(db, "Misconduct");
    const userRef = collection(db, "userDetails");
    const callRef = collection(db, "calls");
    const syncRef = collection(db, "syncs");
    const eventRef = collection(db, "Events");
    const misconductRef = collection(db, "Misconduct");
    getDocs(misconductRef).then((querySnapshot) => {
      setDocCount(querySnapshot.size);
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        setMisconductList((prevState) => ({
          ...prevState,
          [doc.id]: { id: doc.id, ...doc.data() },
        }));
      });
    });

    getDocs(userRef).then((querySnapshot) => {
      setUserCount(querySnapshot.size);
    });

    getDocs(callRef).then((querySnapshot) => {
      setCallCount(querySnapshot.size);
    });

    getDocs(syncRef).then((querySnapshot) => {
      setSyncCount(querySnapshot.size);
    });
    getDocs(eventRef).then((querySnapshot) => {
      setEventCount(querySnapshot.size);
    });
  }, []);

  useEffect(() => {
    console.log(misconductList);
  }, [misconductList]);

  const downloadPdf = () => {
    var docDefinition = {
      content: [
        {
          text: "Synergy Analytics March 2024",
          alignment: "center",
          bold: true,
          fontSize: 14,
          margin: [0, 0, 0, 10], // Add some margin at the bottom
        },
        {
          text: "Number of Users: " + userCount,
          bold: true,
          fontSize: 12,
          margin: [0, 0, 0, 10], // Add some margin at the bottom
        },
        {
          text: "Number of Calls: " + callCount,
          bold: true,
          fontSize: 12,
          margin: [0, 0, 0, 10], // Add some margin at the bottom
        },
        {
          text: "Number of Syncs: " + syncCount,
          bold: true,
          fontSize: 12,
          margin: [0, 0, 0, 10], // Add some margin at the bottom
        },
        {
          text: "Number of Events Hosted: " + eventCount,
          bold: true,
          fontSize: 12,
          margin: [0, 0, 0, 10], // Add some margin at the bottom
        },
        {
          text: "Most Used Tool: " + analytics.mostUsedTool,
          bold: true,
          fontSize: 12,
          margin: [0, 0, 0, 10], // Add some margin at the bottom
        },
      ],
    };

    pdfMake.createPdf(docDefinition).download("Document.pdf");
  };

  const handleIgnoreReport = async (id) => {
    // const docId = misconductList[index].id;
    const docRef = doc(db, "Misconduct", id);
    await deleteDoc(docRef);
    setMisconductList((prevState) => {
      const newState = { ...prevState };
      delete newState[id];
      return newState;
    });
    setDocCount(docCount - 1);
    handleCloseHandle();
  };

  const addReports = async () => {
    for (const report of reporttoadd) {
      try {
        const docRef = await addDoc(collection(db, "Misconduct"), report);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  const downloadJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(analytics));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDelete = async (userId) => {
    const userRef = collection(db, "userDetails");
    const q = query(userRef, where("userID", "==", userId));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref)
        .then(() => {
          setOpenAlert(true);
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing user: ", error);
        });
    });
  };

  return (
    <Box sx={{ bgcolor: "#ded9d5", height: "100vh", width: "100vw" }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#0c2c4b", width: "100vw" }}
      >
        <Toolbar>
          <Typography variant="h6" component="div">
            Moderator Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <div>
            <Button onClick={handleMenu} color="inherit">
              <AccountCircle />
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Sign Out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          // flexDirection: { lg: "row", md: "row", sm: "column", xs: "column" },
          justifyContent: "space-between",
          alignItems: "stretch",
          height: "calc(95vh - 64px)", // subtract AppBar height
          pt: 2,
          px: 2,
        }}
      >
        <Box
          sx={{
            width: "65%",
            bgcolor: "white",
            borderRadius: 1,
            p: 2,
            mr: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "1.5em",
                marginLeft: "5px",
                marginBottom: "1.5vh",
              }}
            >
              Platform Analytics:
            </Typography>
            <Grid container spacing={2} sx={{ padding: "15px" }}>
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Box
                  sx={{
                    bgcolor: "#f9f9f9",
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Number of Users:
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      color: "#0c2c4b",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {/* {Object.values(misconductList).map((item) => {
                      return item.userID;
                    })} */}
                    {userCount}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Box
                  sx={{
                    bgcolor: "#f9f9f9",
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Number of Calls:
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      color: "#0c2c4b",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {callCount}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Box
                  sx={{
                    bgcolor: "#f9f9f9",
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Number of Reports:
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      color: "#0c2c4b",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {docCount}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={16}>
                <Box
                  sx={{
                    bgcolor: "#f9f9f9",
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Number of Events Hosted:
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      color: "#0c2c4b",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {eventCount}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={16}>
                <Box
                  sx={{
                    bgcolor: "#f9f9f9",
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Most Used Tool:
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      color: "#0c2c4b",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {analytics.mostUsedTool}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: "#0c2c4b", marginRight: "10px" }}
              startIcon={<Download></Download>}
              onClick={downloadJson}
            >
              Download JSON file
            </Button>

            <Button
              variant="contained"
              sx={{ backgroundColor: "#0c2c4b" }}
              startIcon={<Download></Download>}
              onClick={downloadPdf}
            >
              Download Analytics Report
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            width: "35%",
            bgcolor: "white",
            borderRadius: 1,
            p: 2,
            overflowY: { md: "auto", sm: "none", xs: "none" },
          }}
        >
          <Typography
            sx={{ fontSize: "1.5em", marginLeft: "5px", marginBottom: "1.5vh" }}
          >
            User Reports:
          </Typography>
          {Object.values(misconductList).map((item, index) => {
            return (
              <Box
                key={index}
                sx={{
                  bgcolor: "#f7f7f7",
                  borderRadius: 1,
                  p: 2.5,
                  mb: 2, // Add some margin at the bottom of each report box
                }}
              >
                <Typography variant="h6">{item.reportCategory}</Typography>
                <Typography variant="body1">
                  Date:{" "}
                  {new Date(item.dateReported.seconds * 1000).toDateString()}
                </Typography>
                <Typography variant="body2">
                  Reported User: {item.userID}
                </Typography>
                <Typography variant="body2">
                  Report Description: {item.reportDesc}
                </Typography>
                <Typography variant="body2">
                  Reported By: {item.reportedBy}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#0c2c4b",
                    marginLeft: { lg: "18vw", md: "0vw", sm: "0vw", xs: "0vw" },
                  }}
                  startIcon={<InfoIcon></InfoIcon>}
                  onClick={(event) => handleClickReport(event, index)}
                >
                  Handle Issue
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorHandle}
                  keepMounted
                  open={Boolean(anchorHandle) && selectedIndex === index}
                  onClose={handleCloseHandle}
                >
                  <MenuItem onClick={() => handleDelete(item.userID)}>
                    Ban User
                  </MenuItem>
                  <MenuItem onClick={() => handleIgnoreReport(item.id)}>
                    Ignore Report
                  </MenuItem>
                  <MenuItem onClick={handleCloseHandle}>
                    <a
                      href={`mailto:${item.userID}@gmail.com?subject=Warning from Synergy: Reported Misconduct&body=Dear ${item.reportedName},%0D%0A%0D%0AWe're writing to address recent misconduct that has been brought to our attention:%0D%0A%0D%0A${item.reportDesc}%0D%0A%0D%0ASuch behavior is unacceptable and violates our community guidelines.%0D%0A%0D%0AContinued violations may result in a user ban. Please take immediate action to rectify this issue and prevent further incidents.%0D%0A%0D%0AIf you have any questions or concerns, please reach out to us promptly.%0D%0A%0D%0AThank you for your cooperation.%0D%0A%0D%0ARegards,%0D%0ASynergy Team`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Send Warning
                    </a>
                  </MenuItem>
                </Menu>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={() => setOpenAlert(false)}
      >
        <MuiAlert
          onClose={() => setOpenAlert(false)}
          severity="success"
          elevation={6}
          variant="filled"
        >
          User successfully deleted!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
