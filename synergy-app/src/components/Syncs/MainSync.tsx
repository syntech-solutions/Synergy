/**
 * Sign-in component for the application.
 * Allows users to sign in using email and password or with Google.
 */
import React from "react";
import { useState } from "react";
import { auth, provider } from "../../config/firebase";
import { db } from "../../config/firebase"; // Import the necessary package
import { FirebaseError } from "@firebase/util";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Import the necessary package
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  Toolbar,
  Divider,
  Typography,
  ListItemAvatar,
  Avatar,
  Drawer,
  AppBar,
  IconButton,
  ListItemButton,
  Tab,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useParams } from "react-router-dom";

// Temporary data for the files
function generate(element: any) {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

const MainSync = (props: any) => {
  // states for drawer and functions and stuff
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [secondary] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
  //   Function for drawer end
  // Value of Tab on mobile device
  const [value, setValue] = React.useState(0);
  //   Function for changing tab value on mobile device
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  // drawer component
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <Box
        sx={{
          display: "block",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <Typography variant="h6" noWrap component="div">
          Description
        </Typography>
        <Typography variant="body1" noWrap component="div">
          Sync Description
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", p: "10px" }}>
        <Typography variant="h6" noWrap component="div" sx={{ p: "10px" }}>
          Sub Syncs
        </Typography>
        <AddBoxIcon
          sx={{
            color: "#EE964B",
            fontSize: "30px",
            cursor: "pointer",
            ml: "auto",
            mt: "auto",
            mb: "auto",
          }}
        />
      </Box>
      <Box sx={{ overflow: "auto", height: "200px" }}>
        <List>
          {generate(
            <ListItemButton onClick={() => console.log()}>
              <ListItemText primary="Sub Sync Name" />
            </ListItemButton>
          )}
        </List>
      </Box>

      <Divider />
      <Box sx={{ display: "flex", p: "10px" }}>
        <Typography variant="h6" noWrap component="div" sx={{ p: "10px" }}>
          Members
        </Typography>
        <AddBoxIcon
          sx={{
            color: "#EE964B",
            fontSize: "30px",
            cursor: "pointer",
            ml: "auto",
            mt: "auto",
            mb: "auto",
          }}
        />
      </Box>
      <Box sx={{ overflow: "auto", height: "200px" }}>
        <List>
          {generate(
            <ListItemButton onClick={() => console.log()}>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText primary="Member Name" />
            </ListItemButton>
          )}
        </List>
      </Box>
    </div>
  );

  // Sample data from the database
  const foldersAndFiles = [
    { name: "Folder 1", type: "folder" },
    { name: "File 1", type: "file" },
    { name: "Folder 2", type: "folder" },
    { name: "File 2", type: "file" },
    { name: "Folder 1", type: "folder" },
    { name: "File 1", type: "file" },
    { name: "Folder 2", type: "folder" },
    { name: "File 2", type: "file" },
    { name: "Folder 1", type: "folder" },
    { name: "File 1", type: "file" },
    { name: "Folder 2", type: "folder" },
    { name: "File 2", type: "file" },
    { name: "Folder 1", type: "folder" },
    { name: "File 1", type: "file" },
    { name: "Folder 2", type: "folder" },
    { name: "File 2", type: "file" },
    { name: "Folder 1", type: "folder" },
    { name: "File 1", type: "file" },
    { name: "Folder 2", type: "folder" },
    { name: "File 2", type: "file" },
    { name: "Folder 1", type: "folder" },
    { name: "File 1", type: "file" },

    // Add more data as needed
  ];
  function handleItemClick(item: { name: string; type: string }): void {
    console.log(item);
  }
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const { id } = useParams();

  return (
    <>
      {/* Full Container */}
      <Grid container>
        {/* first grid item left side of the page */}
        <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
          <Box sx={{ display: "flex" }}>
            {/* side bar */}
            {/* <Box
              component="nav"
              sx={{ width: { md: 240 }, flexShrink: { sm: 0 } }}
            >
              <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onTransitionEnd={handleDrawerTransitionEnd}
                onClose={handleDrawerClose}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: "block", sm: "block", md: "none" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: 240,
                  },
                }}
              >
                {drawer}
              </Drawer>
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: "none", sm: "none", md: "block" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: 240,
                  },
                }}
                open
              >
                {drawer}
              </Drawer>

            </Box> */}
            {/* chat */}
            {/* top bar */}
            <Box
              sx={{
                width: "100%",
                height: "60px",
                backgroundColor: "#f9f9f1",
                p: "12px",
                display: "flex",
                boxShadow: 2,
              }}
            >
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                color={"black"}
                sx={{ fontWeight: "300", fontSize: "27px" }}
              >
                {id}
              </Typography>
              <Button
                color="secondary"
                variant="contained"
                sx={{
                  ml: "auto",
                  mt: "auto",
                  mb: "auto",
                  mr: "10px",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Start Meeting
              </Button>
            </Box>
          </Box>
          {/* chat box */}
          <Box>{/* Chat will go here */}</Box>
          {/* Tabs for mobile devices */}
          <Box sx={{ display: { sm: "block", md: "none" } }}>
            <TabContext value={value.toString()}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  variant="fullWidth"
                  onChange={handleChange}
                  indicatorColor="secondary"
                  sx={{ backgroundColor: "#f9f9f1" }}
                >
                  <Tab label="Chat" value="1" />
                  <Tab label="Files" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">Chat</TabPanel>
              {/* Chat Repeated */}
              <TabPanel value="2" sx={{ padding: "0px", margin: "0px" }}>
                {/* Files top bar not showing in sync */}
                {/* <Box
                  sx={{
                    boxShadow: 2,
                    width: "100%",
                    height: "60px",
                    backgroundColor: "#F9F9F1",
                    display: { md: "none", sm: "block", xs: "block" },
                  }}
                ></Box> */}
                {/* Files Box */}
                <Box
                  sx={{
                    height: `calc(100vh - 60px)`,
                    overflow: "auto",
                    width: "100%",
                    display: { md: "none", sm: "block", xs: "block" },
                  }}
                >
                  <List>
                    {foldersAndFiles.map((item, index) => (
                      <ListItem key={index}>
                        <Button
                          onClick={() => handleItemClick(item)}
                          fullWidth
                          sx={{ textAlign: "left" }}
                        >
                          <ListItemText primary={item.name} />
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </TabPanel>
            </TabContext>
          </Box>
        </Grid>

        {/* second grid item right side of the page */}
        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
          {/* Files top bar */}
          <Box
            sx={{
              boxShadow: 2,
              width: "100%",
              height: "60px",
              backgroundColor: "#F9F9F1",
              display: { md: "block", sm: "none", xs: "none" },
              padding: "10px",
            }}
          >
            {" "}
            <Typography
              color={"black"}
              sx={{ fontWeight: "300", fontSize: "27px" }}
            >
              Files
            </Typography>
          </Box>
          {/* Files Box */}
          <Box
            sx={{
              height: `calc(100vh - 60px)`,
              overflow: "auto",
              width: "100%",
              display: { md: "block", sm: "none", xs: "none" },
            }}
          >
            <List>
              {foldersAndFiles.map((item, index) => (
                <ListItem key={index}>
                  <Button
                    onClick={() => handleItemClick(item)}
                    fullWidth
                    sx={{ textAlign: "left" }}
                  >
                    <ListItemText primary={item.name} />
                  </Button>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default MainSync;
