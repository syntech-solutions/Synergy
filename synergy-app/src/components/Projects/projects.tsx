import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ClearIcon from "@mui/icons-material/Clear";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TaskBox from "./TaskBox";

document.body.style.backgroundColor = "#f9f9f1";

const drawerWidth = 240;

function generate(element: React.ReactElement) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

function ProjectsPage(props: React.PropsWithChildren<{ window: Window }>) {
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

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 10px 10px 10px",
        }}
      >
        <Typography variant="h6" noWrap component="div">
          Members
        </Typography>
        <EditIcon
          sx={{
            color: "#EE964B",
            fontSize: "25px",
            cursor: "pointer",
            ml: "60px",
          }}
        />
        <AddBoxIcon
          sx={{
            color: "#EE964B",
            fontSize: "25px",
            cursor: "pointer",
          }}
        />
      </Box>
      <Divider />
      <Box>
        <Grid item xs={12} md={6}>
          <Demo>
            <List>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <ClearIcon sx={{ color: "#EE964B" }} />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  primary="Leader Name"
                  secondary={secondary ? "Secondary text" : "leader"}
                />
              </ListItem>
              {generate(
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <ClearIcon sx={{ color: "#EE964B" }} />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Member Name"
                    secondary={secondary ? "Secondary text" : "member"}
                  />
                </ListItem>
              )}
            </List>
          </Demo>
        </Grid>
      </Box>
      <Divider />
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? window.document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar
          sx={{
            backgroundColor: "#f9f9f1",
            color: "black",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Project Name
          </Typography>
          <MoreHorizIcon
            sx={{
              fontSize: "40px",
              cursor: "pointer",
            }}
          />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. 
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
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>*/}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {/* <Toolbar />  */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0 20px 0",
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: "#05284C", fontWeight: "bold" }}
          >
            Tasks
          </Typography>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            sx={{
              backgroundColor: "#EE964B",
              color: "white",
              ":hover": {
                backgroundColor: "#EE964B",
              },
            }}
          >
            Add Task
          </Button>
        </Box>
        <Grid item xs={12} sm={12} md={6}>
          <Demo>
            <Box sx={{ backgroundColor: "#F9F9F1" }}>
              <TaskBox
                task="Create Whatsapp Group"
                assignee="Assignee Name"
                priority="Low"
                deadline="DD/MM/YYYY"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae eros quis nisl aliquam aliquet."
              />
            </Box>
          </Demo>
        </Grid>
      </Box>
    </Box>
  );
}

export default ProjectsPage;
