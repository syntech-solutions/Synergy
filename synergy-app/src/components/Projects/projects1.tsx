import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
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
import TaskBox from "./TaskBox1";

document.body.style.backgroundColor = "#f9f9f1";

const drawerWidth = 240;

function generate(element: any) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

function ProjectsPage1(props) {
  const [secondary] = React.useState(false);

  // Remove this const when copying and pasting into your project.

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar
          sx={{
            backgroundColor: "#f9f9f1",
            color: "black",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
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
        <Box sx={{ boxSizing: "border-box", width: drawerWidth }}>
          <Toolbar />
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 10px 10px 10px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#05284C", fontWeight: "bold" }}
            >
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
        </Box>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
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
              {generate(
                <TaskBox
                  task="Task Name"
                  assignee="Assignee Name"
                  priority="Low"
                  deadline="DD/MM/YYYY"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae eros quis nisl aliquam aliquet."
                />
              )}
            </Box>
          </Demo>
        </Grid>
      </Box>
    </Box>
  );
}

export default ProjectsPage1;
