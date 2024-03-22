import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SyncIcon from "@mui/icons-material/Sync";
import ChatIcon from "@mui/icons-material/Chat";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard.js";
import ChatMain from "../PeopleMain/PeopleMain.js";
import SyncMain from "../Syncs/SyncMain.js";
import ProjectsPage from "../Projects/projects.js";
import { useState } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SimpleBottomNavigation from "./BottomNav.js";
import routes from "../../routes/Routes.js";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase.js";
import MainSync from "../Syncs/MainSync.js";
import { useEffect } from "react";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer({ mainContent = <Dashboard /> }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [selectedPage, setSelectedPage] = useState();

  function handleSelect(selectedButton: any) {
    setSelectedPage(selectedButton);
    console.log(selectedPage);
  }

  let navigate = useNavigate();

  // mainContent = <Dashboard />;
  useEffect(() => {
    if (selectedPage) {
      if (selectedPage === "Dashboard") navigate("/MainPage/Dashboard");
      else if (selectedPage === "Chats") navigate("/MainPage/Chats");
      else if (selectedPage === "Syncs") navigate("/MainPage/Syncs");
      else if (selectedPage === "Projects") navigate("/MainPage/Projects");
      else if (selectedPage === "People") navigate("/MainPage/People");
      else if (selectedPage === "Profile") navigate("/MainPage/Profile");
      // if (selectedPage === "Dashboard") "Settings":
      else if (selectedPage === "Logout") {
        signOut(auth);
        navigate("/");
      }
    }
  }, [selectedPage]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar sx={{ position: "fixed" }} open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open
                ? { display: "none" }
                : { display: { xs: "none", sm: "none", md: "flex" } }),
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {["Dashboard", "Syncs", "Chats", "Projects", "People"].map(
            (text, index) => (
              <ListItem
                key={text}
                disablePadding
                sx={{ display: "block" }}
                onClick={() => handleSelect(text)}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {(() => {
                      switch (index) {
                        case 0:
                          return <DashboardIcon />;
                        case 1:
                          return <SyncIcon />;
                        case 2:
                          return <ChatIcon />;
                        case 3:
                          return <AssignmentIcon />;
                        case 4:
                          return <AccountBoxIcon />;
                      }
                    })()}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
        {/* <Divider /> */}
        <Box sx={{ flexGrow: 1, p: 3 }} />
        <Divider />
        <List>
          {["Profile", "Settings", "Logout"].map((text, index) => (
            <ListItem
              key={text}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => handleSelect(text)}
            >
              <ListItemButton
                onClick={() => {
                  switch (index) {
                    case 0:
                      return <AccountBoxIcon />;
                    case 1:
                      return <SettingsIcon />;
                    case 2:
                      return <LogoutIcon />;
                  }
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {(() => {
                    switch (index) {
                      case 0:
                        return <AccountBoxIcon />;
                      case 1:
                        return <SettingsIcon />;
                      case 2:
                        return <LogoutIcon />;
                    }
                  })()}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      {/* <DrawerHeader /> */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          // inset: 100,
        }}
        // sx={{ flexGrow: 1, p: 3, position: "fixed", inset: 50 }}
      >
        <DrawerHeader />
        {mainContent}
      </Box>
      <SimpleBottomNavigation />
    </Box>
  );
}
