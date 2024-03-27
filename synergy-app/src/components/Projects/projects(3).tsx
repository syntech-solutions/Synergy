import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import styled from "@mui/material/styles/styled";
import InputAdornment from "@mui/material/InputAdornment";
import Toolbar from "@mui/material/Toolbar";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  getDocData,
  getProjectsData,
  getSyncData,
  getTaskData,
  getTasksData,
  getUserDetails,
  getUserSyncData,
} from "../getFunctions";
import { auth, db } from "../../config/firebase";
import { Autocomplete } from "@mui/material";
import {
  arrayUnion,
  collection,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import ProfilePopup from "../ProfilePage/ProfilePopup";

const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "#FD151B";
    case "medium":
      return "yellow";
    case "low":
      return "#00FF00";
    default:
      return "#ccc";
  }
};

const getPriorityTextColor = (priority) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "white";
    case "medium":
    case "low":
      return "black";
    default:
      return "black";
  }
};

document.body.style = "background: #f9f9f1;";

const drawerWidth = 240;

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const TaskBox = ({
  id,
  title: initialTitle,
  assignee: initialAssignee,
  priority: initialPriority,
  deadline: initialDeadline,
  description: initialDescription,
  completed: initialCompleted,
  onSave,
  onTaskCompleted,
  onTaskIncompleted,
  members,
}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [assignee, setAssignee] = useState(initialAssignee);
  const [priority, setPriority] = useState(initialPriority);
  const [deadline, setDeadline] = useState(initialDeadline);
  const [description, setDescription] = useState(initialDescription);
  const [completed, setCompleted] = useState(initialCompleted);
  const [selectedAssignee, setSelectedAssignee] = useState(initialAssignee);
  const priorityColor = getPriorityColor(priority);
  const priorityTextColor = getPriorityTextColor(priority);
  const [isPriorityFieldFocused, setIsPriorityFieldFocused] =
    React.useState(false);

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      onTaskCompleted(id); // Pass the task ID or index
    } else {
      onTaskIncompleted(id); // Pass the task ID or index
    }
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancelClick = () => {
    setTitle(initialTitle);
    setAssignee(initialAssignee);
    setPriority(initialPriority);
    setDeadline(initialDeadline);
    setDescription(initialDescription);
    setCompleted(initialCompleted);
    setEditing(false);
  };

  const handleSaveClick = () => {
    const updatedTask = {
      id,
      title,
      assignee: selectedAssignee,
      priority,
      deadline,
      description,
      completed,
    };
    setAssignee(selectedAssignee);
    onSave(updatedTask); // Call onSave with the updated task
    setEditing(false); // Exit edit mode
  };

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#fff",
        border: "1px solid #dcdcdc",
        borderRadius: "5px",
        padding: "20px",
        marginBottom: "20px",
        width: "100%",
        maxWidth: "400px",
        minWidth: "300px",
      }}
    >
      {editing ? (
        <>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            variant="outlined"
            style={{ marginBottom: "10px" }}
          />
          <TextField
            select
            label="Assignee"
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            fullWidth
            variant="outlined"
            style={{ marginBottom: "10px" }}
          >
            {members.map((member, index) => (
              <MenuItem key={index} value={member.userName}>
                {member.userName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Priority"
            variant="outlined"
            name="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            onFocus={() => setIsPriorityFieldFocused(true)}
            onBlur={() => setIsPriorityFieldFocused(false)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      display: "inline-block",
                      marginRight: 8,
                      backgroundColor:
                        priority === "Low"
                          ? "#00FF00" // Green for Low priority
                          : priority === "Medium"
                          ? "yellow" // Yellow for Medium priority
                          : priority === "High"
                          ? "#FD151B" // Red for High priority
                          : "", // No color if priority is not set
                    }}
                  ></span>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: isPriorityFieldFocused || priority !== "",
            }}
            sx={{ marginBottom: "10px" }}
          >
            <MenuItem value="Low">
              <span style={{ color: "#4caf50" }}>Low</span>
            </MenuItem>
            <MenuItem value="Medium">
              <span style={{ color: "#ff9800" }}>Medium</span>
            </MenuItem>
            <MenuItem value="High">
              <span style={{ color: "#f44336" }}>High</span>
            </MenuItem>
          </TextField>
          <TextField
            label="Deadline"
            value={deadline}
            type="date"
            onChange={(e) => setDeadline(e.target.value)}
            fullWidth
            variant="outlined"
            style={{ marginBottom: "10px" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            style={{ marginBottom: "10px" }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{
                color: "#05284C",
              }}
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
            <Button
              sx={{
                backgroundColor: "#EE964B",
                ":hover": {
                  backgroundColor: "#EE964B",
                },
                color: "white",
              }}
              onClick={handleSaveClick}
            >
              {" "}
              Save
            </Button>
          </div>
        </>
      ) : (
        <>
          <Typography variant="h5" style={{ marginBottom: "10px" }}>
            {title}
          </Typography>
          <div style={{ marginBottom: "10px" }}>
            <strong>Assignee:</strong> {assignee}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Priority:</strong>{" "}
            <Chip
              label={priority}
              sx={{
                color: priorityTextColor,
                backgroundColor: priorityColor,
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Deadline:</strong> {deadline}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Task Description:</strong> {description}
          </div>
          <div>
            <strong>Completed:</strong>{" "}
            <Checkbox
              checked={completed}
              color="success"
              onChange={handleCheckboxChange}
            />
          </div>
          {!completed && ( // Render edit button only if task is not completed
            <IconButton
              onClick={handleEditClick}
              style={{ position: "absolute", top: "5px", right: "5px" }}
            >
              <EditIcon
                sx={{
                  color: "#EE964B",
                  fontSize: "25px",
                  cursor: "pointer",
                }}
              />
            </IconButton>
          )}
        </>
      )}
    </div>
  );
};

const ProjectsPage = (props) => {
  React.useEffect(() => {
    // Fetch or determine the leader of the sync
    // For demonstration purposes, setting it statically
    setSyncLeader("Leader Name");
  }, []);

  const { id } = useParams();

  const [createdTask, setCreatedTask] = useState(false);

  const [members, setMembers] = React.useState([
    { name: "Leader Name", role: "admin" },
  ]);
  const [syncLeader, setSyncLeader] = React.useState("Leader Name");
  const [newMemberName, setNewMemberName] = React.useState("");
  const [isAddMemberDialogOpen, setAddMemberDialogOpen] = React.useState(false);
  const [isMemberEditMode, setMemberEditMode] = React.useState(true);
  const [selectedMemberIndex, setSelectedMemberIndex] = React.useState(null);
  const [isMemberDeleteConfirmationOpen, setMemberDeleteConfirmationOpen] =
    React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [secondary] = React.useState(false);
  const [tasks, setTasks] = React.useState([]);
  const [isAddTaskDialogOpen, setAddTaskDialogOpen] = React.useState(false);
  const [newTask, setNewTask] = React.useState({
    title: "",
    assignee: "",
    priority: "",
    deadline: "",
    description: "",
  });
  const [completedTasks, setCompletedTasks] = React.useState([]);
  const [completedTasksPanelMinimized, setCompletedTasksPanelMinimized] =
    React.useState(false);
  const [isPriorityFieldFocused, setIsPriorityFieldFocused] =
    React.useState(false);

  // const handleDeleteMember = (index) => {
  //   setSelectedMemberIndex(index);
  //   setMemberDeleteConfirmationOpen(true);
  // };

  const handleDeleteMember = async (index: any, memberId: any) => {
    try {
      const docData = await getUserSyncData(memberId);
      const tempData = { ...docData };
      console.log(tempData);
      delete tempData.projectID[id];
      const userDataRef = doc(db, "userData", memberId);
      await updateDoc(userDataRef, tempData);
    } catch (e) {
      console.log(e);
    }

    const projectRef = doc(db, "projects", id);

    try {
      const docData = await getProjectsData(id);
      const tempData = { ...docData };
      console.log(tempData.projectMembers);
      const updatedMembers = tempData.projectMembers.filter(
        (member: any) => member.memberID !== memberId
      );
      await updateDoc(projectRef, { projectMembers: updatedMembers });
    } catch (e) {
      console.log(e);
    }

    setSelectedMemberIndex(index);
    setMemberDeleteConfirmationOpen(true);
    setMemberEditMode(false);
  };

  const handleCancelDelete = () => {
    setSelectedMemberIndex(null);
    // Close both member and sub-sync delete confirmation dialogs
    setMemberDeleteConfirmationOpen(false);
  };

  const handleAddMember = async () => {
    memberArray.forEach(async (member: any) => {
      getUserDetails(member.memberID).then((userDetail) => {
        console.log(userDetail);
        if (userDetail && !userDetail.error) {
          setMembers([...members, { ...userDetail, role: "member" }]);
        }
      });
      const memberProjectRef = doc(db, "userData", member.memberID);

      try {
        const userDataProjectDetails = {
          projectName: projectName,
        };
        await updateDoc(memberProjectRef, {
          [`projectID.${id}`]: userDataProjectDetails,
        });
      } catch (e) {
        console.log(e);
      }

      const projectRef = doc(db, "projects", id);
      const toAddMemberArray = memberArray.map((member: any) => {
        return { role: "member", memberID: member.memberID };
      });
      console.log(toAddMemberArray);
      try {
        await updateDoc(projectRef, {
          projectMembers: arrayUnion(...toAddMemberArray),
        });
      } catch (e) {
        console.log(e);
      }
    });
    setAddMemberDialogOpen(false);
  };

  const handleMemberEditToggle = () => {
    setMemberEditMode(!isMemberEditMode);
  };

  const handleClickMoreOptions = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const [profilePopup, setProfilePopup] = React.useState(false);

  const handleMenuAction = (action, index, id: string) => {
    switch (action) {
      case "remove member":
        handleDeleteMember(index, id);
        break;
      case "make admin":
        handleMakeAdmin(index);
        break;
      case "remove admin":
        handleRemoveAdmin(index);
        break;
      case "go to profile":
        setProfileViewId(id);
        setProfilePopup(true);
        handleCloseMenu();
        break;
      default:
        console.error("Invalid action");
    }
  };

  const handleMakeAdmin = (index) => {
    const updatedMembers = [...members];
    updatedMembers[index].role = "admin";
    setMembers(updatedMembers);
  };

  const handleRemoveAdmin = (index) => {
    // Check if the logged-in user is the leader
    if (members[index].role === "admin" && members[index].name !== syncLeader) {
      const updatedMembers = [...members];
      updatedMembers[index].role = "member";
      setMembers(updatedMembers);
    } else {
      console.log(
        "Only the project leader can remove admin role from other admins."
      );
    }
  };

  const handleConfirmDeleteMember = () => {
    const removedMemberIndex = selectedMemberIndex;
    const updatedMembers = members.filter(
      (_, index) => index !== removedMemberIndex
    );
    setMembers(updatedMembers);
    // Close the member delete confirmation dialog
    setMemberDeleteConfirmationOpen(false);
  };

  const handleAddTask = () => {
    setAddTaskDialogOpen(true);
  };

  const handleTaskFormChange = (event) => {
    const { name, value } = event.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleTaskFormSubmit = async () => {
    const newTaskRef = doc(collection(db, "projects", id, "tasks"));
    try {
      await setDoc(newTaskRef, newTask);
    } catch (e) {
      console.log(e);
    }

    const memberData = await getDocData("userDetails");

    let taskAssigneeID = "";

    memberData?.map((member: any) => {
      if (member.userName === newTask.assignee) {
        taskAssigneeID = member.memberID;
      }
    });

    console.log(taskAssigneeID);

    try {
      const userTaskRef = doc(db, "userData", taskAssigneeID);
      await updateDoc(userTaskRef, { [`taskID.${newTaskRef.id}`]: newTask });
    } catch (e) {
      console.error(e);
    }

    // Add the task without checking if all fields are filled
    // setTasks([...tasks, newTask]);
    // Reset the newTask state to clear the form fields
    setNewTask({
      title: "",
      assignee: "",
      priority: "",
      deadline: "",
      description: "",
    });
    // Close the Add Task dialog
    setAddTaskDialogOpen(false);
    setCreatedTask(true);
  };

  const handleTaskCompleted = (index) => {
    const completedTask = { ...tasks[index], id: uuidv4() }; // Generate a new id for the completed task
    setCompletedTasks([...completedTasks, completedTask]);
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleTaskIncompleted = (index) => {
    const incompletedTask = completedTasks[index];
    incompletedTask.completed = false;
    setTasks([...tasks, incompletedTask]);
    const updatedCompletedTasks = completedTasks.filter((_, i) => i !== index);
    setCompletedTasks(updatedCompletedTasks);
  };

  const toggleCompletedTasksPanel = () => {
    setCompletedTasksPanelMinimized(!completedTasksPanelMinimized);
  };

  const updateTask = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? { ...task, ...updatedTask } : task
    );
    setTasks(updatedTasks);
  };

  const [projectName, setProjectName] = useState("Project Name");
  const [projectOwner, setProjectOwner] = useState("Owner Name");
  const [projectData, setProjectData] = useState({});
  const [projectMemberArray, setProjectMemberArray] = useState([]);
  const [memberSearch, setMemberSearch] = useState([]);
  const [addMembers, setAddMembers] = useState([]);
  const [profileViewId, setProfileViewId] = React.useState("");
  const closeProfilePopup = () => {
    setProfilePopup(false);
  };
  useEffect(() => {
    (async () => {
      try {
        const reqProjectData = await getProjectsData(id);
        setProjectName(reqProjectData.projectName);
        setProjectData(reqProjectData);
        console.log(reqProjectData);
        setProjectOwner(reqProjectData.projectOwner);
        setSyncLeader(reqProjectData.projectOwner);
        setProjectMemberArray(reqProjectData.projectMembers);
        console.log(reqProjectData.projectMembers);
        // console.log(syncData);

        const reqTasksData = await getTasksData(id);

        console.log(reqTasksData);

        setTasks(reqTasksData);
        setCreatedTask(false);

        const memberData = await getDocData("userDetails");
        // console.log(memberData);

        let membersName: any = [];

        let projectMembersUserDetails: any = [];

        memberData?.forEach((member: any) => {
          if (member.memberID !== auth.currentUser?.uid) {
            membersName.push({
              userName: member.userName,
              userEmail: member.userEmail,
              memberID: member.memberID,
            });
          }
          projectMembersUserDetails.push(member);
        });
        // console.log(typeof membersName);
        // console.log(projectMembersUserDetails);

        console.log(reqProjectData.projectMembers);

        setMembers(
          projectMembersUserDetails
            .filter((member: any) =>
              reqProjectData.projectMembers
                .map((member: any) => member.memberID, member.role)
                .includes(member.memberID)
            )
            .map((element: any) => {
              if (element.memberID === auth.currentUser?.uid)
                return { ...element, role: "admin" };
              else return { ...element, role: "member" };
            })
        );

        setMemberSearch(
          membersName.filter(
            (n: any) =>
              !reqProjectData.projectMembers
                .map((member: any) => member.memberID)
                .includes(n.memberID)
          )
        );
      } catch (err) {
        console.log(err);
      }
    })();
  }, [createdTask]);
  const [memberArray, setMemberArray] = useState<any>([]);

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#f9f9f1",
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          width: "100%",
          borderBottom: "2px solid #dcdcdc",
          backgroundColor: "#f9f9f1",
          position: "fixed",
          zIndex: 1,
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
          <Typography
            sx={{
              color: "#05284C",
              fontWeight: "bold",
              backgroundColor: "#f9f9f1",
            }}
            variant="h6"
            noWrap
            component="div"
          >
            {projectName}
          </Typography>
        </Toolbar>
      </Box>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Box sx={{ boxSizing: "border-box", width: drawerWidth }}>
          <Toolbar />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: 1,
              mt: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#05284C", fontWeight: "bold" }}
            >
              Members
            </Typography>
            {/* {members.length > 1 && (
              <EditIcon
                sx={{
                  color: "#EE964B",
                  fontSize: "25px",
                  cursor: "pointer",
                  ml: "60px",
                }}
                onClick={handleMemberEditToggle}
              />
            )} */}
            <AddBoxIcon
              sx={{
                color: "#EE964B",
                fontSize: "25px",
                cursor: "pointer",
              }}
              onClick={() => setAddMemberDialogOpen(true)}
            />
          </Box>
          <Divider />
          <Box>
            <Grid item xs={12} md={6}>
              <Demo>
                <List>
                  {members.map((member, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        isMemberEditMode &&
                        ((member.role === "admin" &&
                          member.name !== syncLeader) ||
                          member.role === "member") && (
                          <div>
                            <IconButton
                              edge="end"
                              aria-label="more options"
                              onClick={(event) =>
                                handleClickMoreOptions(event, index)
                              }
                            >
                              <MoreVertIcon sx={{ color: "#EE964B" }} />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={
                                Boolean(anchorEl) && selectedIndex === index
                              }
                              onClose={handleCloseMenu}
                            >
                              {member.role === "member" &&
                                auth.currentUser?.uid === projectOwner && (
                                  <MenuItem
                                    onClick={() =>
                                      handleMenuAction("make admin", index)
                                    }
                                  >
                                    Make Admin
                                  </MenuItem>
                                )}
                              {member.role === "admin" &&
                                member.name !== syncLeader &&
                                auth.currentUser?.uid === projectOwner && (
                                  <MenuItem
                                    onClick={() =>
                                      handleMenuAction("remove admin", index)
                                    }
                                  >
                                    Remove Admin
                                  </MenuItem>
                                )}
                              {auth.currentUser?.uid === projectOwner && (
                                <MenuItem
                                  onClick={() =>
                                    handleMenuAction(
                                      "remove member",
                                      index,
                                      member.memberID
                                    )
                                  }
                                >
                                  Remove Member
                                </MenuItem>
                              )}
                              <MenuItem
                                onClick={() =>
                                  handleMenuAction(
                                    "go to profile",
                                    index,
                                    member.memberID
                                  )
                                }
                              >
                                Go to Profile
                              </MenuItem>
                            </Menu>
                          </div>
                        )
                      }
                    >
                      <ListItemAvatar>
                        <Avatar />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          member.role === "admin"
                            ? member.userName
                            : member.userName
                        }
                        secondary={secondary ? "Secondary text" : member.role}
                      />
                    </ListItem>
                  ))}
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
        <Dialog
          open={isMemberDeleteConfirmationOpen}
          onClose={handleCancelDelete}
        >
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to remove this member?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              sx={{
                color: "#05284C",
              }}
              onClick={handleCancelDelete}
            >
              Cancel
            </Button>
            <Button
              sx={{
                backgroundColor: "#EE964B",
                ":hover": {
                  backgroundColor: "#EE964B",
                },
                color: "white",
              }}
              onClick={handleConfirmDeleteMember}
            >
              Remove
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isAddMemberDialogOpen}
          onClose={() => setAddMemberDialogOpen(false)}
        >
          <DialogTitle>Add Members</DialogTitle>
          <DialogContent>
            {/* <TextField
              autoFocus
              margin="dense"
              label="Member Name"
              fullWidth
              variant="outlined"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
            /> */}
            <Autocomplete
              fullWidth={true}
              multiple
              id="members"
              // name="syncDesc"
              // type="syncDesc"
              options={memberSearch}
              getOptionLabel={(option) => option.userName}
              // defaultValue={[top100Films[13]]}
              filterSelectedOptions
              onChange={(events, value) => setMemberArray(value)}
              renderInput={(params) => (
                <TextField
                  margin="dense"
                  {...params}
                  label="Add Members"
                  placeholder="Members"
                  type="member"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button
              sx={{
                color: "#05284C",
              }}
              onClick={() => setAddMemberDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              sx={{
                backgroundColor: "#EE964B",
                ":hover": {
                  backgroundColor: "#EE964B",
                },
                color: "white",
              }}
              onClick={handleAddMember}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isAddTaskDialogOpen}
          onClose={() => setAddTaskDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add Task</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  sx={{ mt: 2 }}
                  autoFocus
                  fullWidth
                  label="Task Title"
                  variant="outlined"
                  name="title"
                  value={newTask.title}
                  onChange={handleTaskFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Assignee"
                  variant="outlined"
                  name="assignee"
                  value={newTask.assignee}
                  onChange={handleTaskFormChange}
                >
                  {members.map((member, index) => (
                    <MenuItem key={index} value={member.userName}>
                      {member.userName}
                    </MenuItem>
                  ))}
                </TextField>
                {/* <Autocomplete
                  fullWidth={true}
                  multiple
                  id="members"
                  options={memberSearch}
                  getOptionLabel={(option) => option.userName}
                  filterSelectedOptions
                  onChange={(events, value) => setMemberArray(value)}
                  renderInput={(params) => (
                    <TextField
                      margin="dense"
                      {...params}
                      label="Add Members"
                      placeholder="Members"
                      type="member"
                    />
                  )}
                /> */}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Priority"
                  variant="outlined"
                  name="priority"
                  value={newTask.priority}
                  onChange={handleTaskFormChange}
                  onFocus={() => setIsPriorityFieldFocused(true)}
                  onBlur={() => setIsPriorityFieldFocused(false)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            display: "inline-block",
                            marginRight: 8,
                            backgroundColor:
                              newTask.priority === "Low"
                                ? "#00FF00" // Green for Low priority
                                : newTask.priority === "Medium"
                                ? "yellow" // Yellow for Medium priority
                                : newTask.priority === "High"
                                ? "#FD151B" // Red for High priority
                                : "", // No color if priority is not set
                          }}
                        ></span>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: isPriorityFieldFocused || newTask.priority !== "",
                  }}
                >
                  <MenuItem value="Low">
                    <span style={{ color: "#4caf50" }}>Low</span>
                  </MenuItem>
                  <MenuItem value="Medium">
                    <span style={{ color: "#ff9800" }}>Medium</span>
                  </MenuItem>
                  <MenuItem value="High">
                    <span style={{ color: "#f44336" }}>High</span>
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Deadline"
                  type="date"
                  variant="outlined"
                  name="deadline"
                  value={newTask.deadline}
                  onChange={handleTaskFormChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  variant="outlined"
                  name="description"
                  value={newTask.description}
                  onChange={handleTaskFormChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setAddTaskDialogOpen(false)}
              sx={{
                color: "#05284C",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTaskFormSubmit}
              variant="contained"
              sx={{
                backgroundColor: "#EE964B",
                ":hover": {
                  backgroundColor: "#EE964B",
                },
                color: "white",
              }}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
        {profilePopup && (
          <ProfilePopup
            userID={profileViewId}
            popUp={profilePopup}
            closeProfilePopup={closeProfilePopup}
          />
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: "#05284C", fontWeight: "bold" }}
          >
            Tasks
          </Typography>
          <AddBoxIcon
            sx={{
              color: "#EE964B",
              fontSize: "40px",
              cursor: "pointer",
            }}
            onClick={handleAddTask}
          />
        </Box>
        <Grid item xs={12} sm={12} md={6}>
          {tasks.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: "center", p: 2 }}>
              There are currently no tasks to complete
            </Typography>
          ) : (
            tasks.map((task, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: "#F9F9F1",
                  display: "inline-flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  mr: 3,
                }}
              >
                <TaskBox
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  assignee={task.assignee}
                  priority={task.priority}
                  deadline={task.deadline}
                  description={task.description}
                  onTaskCompleted={() => handleTaskCompleted(index)}
                  onSave={updateTask}
                  members={members}
                />
              </Box>
            ))
          )}
        </Grid>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 7,
            }}
          >
            <Typography
              variant="h4"
              sx={{ color: "#05284C", fontWeight: "bold" }}
            >
              Completed Tasks
            </Typography>
            <IconButton onClick={toggleCompletedTasksPanel}>
              {completedTasksPanelMinimized ? (
                <KeyboardArrowDownIcon
                  sx={{
                    color: "#EE964B",
                    fontSize: "40px",
                  }}
                />
              ) : (
                <KeyboardArrowUpIcon
                  sx={{
                    color: "#EE964B",
                    fontSize: "40px",
                  }}
                />
              )}
            </IconButton>
          </Box>
          {!completedTasksPanelMinimized && (
            <>
              {completedTasks.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: "center", p: 2 }}>
                  There are currently no completed tasks
                </Typography>
              ) : (
                completedTasks.map((task, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: "#F9F9F1",
                      display: "inline-flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      overflowY: "auto",
                      mr: 3,
                    }}
                  >
                    <TaskBox
                      title={task.title}
                      assignee={task.assignee}
                      priority={task.priority}
                      deadline={task.deadline}
                      description={task.description}
                      completed={true}
                      onTaskIncompleted={() => handleTaskIncompleted(index)}
                      onSave={updateTask}
                      members={members}
                    />
                  </Box>
                ))
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectsPage;
