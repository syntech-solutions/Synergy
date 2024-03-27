import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CallIcon from "@mui/icons-material/Call";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClearIcon from "@mui/icons-material/Clear";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Autocomplete, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getDocData,
  getSyncData,
  getUserDetails,
  getUserSyncData,
} from "../getFunctions";
import { auth, db } from "../../config/firebase";
import ProfilePopup from "../ProfilePage/ProfilePopup";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import Header from "../FileStorage/Header";
import FilesView from "../FileStorage/FilesView";
import { createPortal } from "react-dom";
import CallScreen from "../Call/CallScreen";

document.body.style.backgroundColor = "#f9f9f1";

const drawerWidth = 240;
const toolbarWidth = 60;

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

function SyncsPage(props: any) {
  const { id } = useParams();

  // console.log(id);
  const [members, setMembers] = React.useState([
    {
      userName: "Leader Name",
      role: "admin",
      userEmail: "",
      DOB: "",
      profilePic: "",
      userType: "",
      userCompany: "",
      userSkills: "",
      userAbout: "",
      memberID: "",
    },
  ]);
  const [syncLeader, setSyncLeader] = React.useState("Leader Name");
  const [newMemberName, setNewMemberName] = React.useState("");
  const [isAddMemberDialogOpen, setAddMemberDialogOpen] = React.useState(false);
  const [isMemberEditMode, setMemberEditMode] = React.useState(true);
  const [isSubSyncEditMode, setSubSyncEditMode] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [selectedMemberIndex, setSelectedMemberIndex] = React.useState(null);
  const [isMemberDeleteConfirmationOpen, setMemberDeleteConfirmationOpen] =
    React.useState(false);
  const [isSubSyncDeleteConfirmationOpen, setSubSyncDeleteConfirmationOpen] =
    React.useState(false);
  const [isCreateSubSyncDialogOpen, setCreateSubSyncDialogOpen] =
    React.useState(false);
  const [subSyncName, setSubSyncName] = React.useState("");
  const [selectedMembers, setSelectedMembers] = React.useState([]);
  const [secondary] = React.useState(false);
  const [subSyncs] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [isManageMembersDialogOpen, setManageMembersDialogOpen] =
    React.useState(false);
  const [selectedSubSyncIndex, setSelectedSubSyncIndex] = React.useState(null);

  const handleDeleteMember = async (index: any, memberId: any) => {
    try {
      const docData = await getUserSyncData(memberId);
      const tempData = { ...docData };
      console.log(tempData);
      delete tempData.syncID[id];
      const userDataRef = doc(db, "userData", memberId);
      await updateDoc(userDataRef, tempData);
    } catch (e) {
      console.log(e);
    }

    const syncRef = doc(db, "syncs", id);

    try {
      const docData = await getSyncData(id);
      const tempData = { ...docData };
      console.log(tempData.syncMembers);
      const updatedMembers = tempData.syncMembers.filter(
        (member: any) => member.memberID !== memberId
      );
      await updateDoc(syncRef, { syncMembers: updatedMembers });
    } catch (e) {
      console.log(e);
    }

    setSelectedMemberIndex(index);
    setMemberDeleteConfirmationOpen(true);
    setMemberEditMode(false);
  };

  const removeMemberFromSubSyncs = (memberIndex: any) => {
    const updatedSubSyncs = subSyncs.map((subSync) => {
      const updatedMembers = subSync.members.filter(
        (member: any) => member !== memberIndex
      );
      return { ...subSync, members: updatedMembers };
    });
    updatedSubSyncs;
  };

  const handleCancelDelete = () => {
    setSelectedMemberIndex(null);
    // Close both member and sub-sync delete confirmation dialogs
    setMemberDeleteConfirmationOpen(false);
    setSubSyncDeleteConfirmationOpen(false);
  };

  const handleAddMember = async () => {
    memberArray.forEach(async (member: any) => {
      getUserDetails(member.memberID).then((userDetail) => {
        console.log(userDetail);
        if (userDetail && !userDetail.error) {
          setMembers([...members, { ...userDetail, role: "member" }]);
        }
      });
      const memberSyncRef = doc(db, "userData", member.memberID);

      try {
        const userDataSyncDetails = {
          syncName: syncName,
          syncImage: syncData.syncImage,
        };
        await updateDoc(memberSyncRef, {
          [`syncID.${id}`]: userDataSyncDetails,
        });
      } catch (e) {
        console.log(e);
      }

      const syncRef = doc(db, "syncs", id);
      const toAddMemberArray = memberArray.map((member: any) => {
        return { role: "member", memberID: member.memberID };
      });
      console.log(toAddMemberArray);
      try {
        await updateDoc(syncRef, {
          syncMembers: arrayUnion(...toAddMemberArray),
        });
      } catch (e) {
        console.log(e);
      }
    });
    // if (newMemberName.trim() !== "") {
    //   setNewMemberName("");
    //   setAddMemberDialogOpen(false);
    // }
    setAddMemberDialogOpen(false);
  };

  const handleMemberEditToggle = () => {
    setMemberEditMode(!isMemberEditMode);
  };

  const handleSubSyncEditToggle = () => {
    setSubSyncEditMode(!isSubSyncEditMode);
  };

  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };

  const handleCreateSubSync = () => {
    setCreateSubSyncDialogOpen(true);
  };

  const handleCancelCreateSubSync = () => {
    setCreateSubSyncDialogOpen(false);
    setSubSyncName("");
    setSelectedMembers([]);
  };

  const handleConfirmCreateSubSync = () => {
    // Perform sub-sync creation logic here
    console.log("Sub-sync name:", subSyncName);
    console.log("Selected members:", selectedMembers);
    const newSubSync = {
      name: subSyncName,
      members: selectedMembers.map((index) => members[index]),
    };
    setSubSyncs([...subSyncs, newSubSync]);
    handleCancelCreateSubSync();
  };

  const handleSubSyncNameChange = (event: any) => {
    setSubSyncName(event.target.value);
  };

  const handleMemberSelectChange = (event: any) => {
    setSelectedMembers(event.target.value);
  };

  const handleClickMoreOptions = (event: any, index: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [profilePopup, setProfilePopup] = React.useState(false);
  const closeProfilePopup = () => {
    setProfilePopup(false);
  };
  const [profileViewId, setProfileViewId] = React.useState("");

  const handleMenuAction = (action: string, index: any, id: string) => {
    switch (action) {
      case "manage members":
        setSelectedSubSyncIndex(index); // Set the selected sub-sync index
        setManageMembersDialogOpen(true); // Open the manage members dialog
        break;
      case "delete sub-sync":
        // Open the sub-sync delete confirmation dialog
        setSubSyncDeleteConfirmationOpen(true);
        setSelectedIndex(index); // Set the selected index
        handleCloseMenu(); // Close the menu
        break;
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

  const handleMakeAdmin = (index: any) => {
    const updatedMembers = [...members];
    updatedMembers[index].role = "admin";
    setMembers(updatedMembers);
  };

  const handleRemoveAdmin = (index: any) => {
    // Check if the logged-in user is the leader
    if (
      members[index].role === "admin" &&
      members[index].userName !== syncLeader
    ) {
      const updatedMembers = [...members];
      updatedMembers[index].role = "member";
      setMembers(updatedMembers);
    } else {
      console.log(
        "Only the sync leader can remove admin role from other admins."
      );
    }
  };

  const handleConfirmDeleteMember = () => {
    const removedMemberIndex = selectedMemberIndex;
    const updatedMembers = members.filter(
      (_, index) => index !== removedMemberIndex
    );
    setMembers(updatedMembers);
    removeMemberFromSubSyncs(removedMemberIndex);
    // Close the member delete confirmation dialog
    setMemberDeleteConfirmationOpen(false);
  };

  const handleDeleteSubSync = (index: any) => {
    setSelectedIndex(index); // Set the selected index
    setSubSyncDeleteConfirmationOpen(true); // Open the confirmation dialog
    handleCloseMenu(); // Close the menu
  };

  const handleConfirmDeleteSubSync = () => {
    const updatedSubSyncs = subSyncs.filter(
      (_, index) => index !== selectedIndex
    );
    setSubSyncs(updatedSubSyncs);
    // Close the sub-sync delete confirmation dialog
    setSubSyncDeleteConfirmationOpen(false);
  };

  const handleRemoveMemberFromSubSync = (memberIndex: any) => {
    const updatedSubSyncs = [...subSyncs];
    updatedSubSyncs[selectedSubSyncIndex].members.splice(memberIndex, 1);
    setSubSyncs(updatedSubSyncs);
  };

  const handleAddMemberToSubSync = (memberIndex: any) => {
    const memberToAdd = members[memberIndex];

    // Check if the member to add is already in the sub-sync
    const isMemberInSubSync = subSyncs[selectedSubSyncIndex]?.members.some(
      (member: any) => member.userName === memberToAdd.name
    );

    // Only add the member if it's not already in the sub-sync
    if (!isMemberInSubSync) {
      const updatedSubSyncs = [...subSyncs];
      updatedSubSyncs[selectedSubSyncIndex].members.push(memberToAdd);
      setSubSyncs(updatedSubSyncs);

      console.log("Member added successfully.");
    } else {
      console.log("Member already exists in sub-sync.");
    }
  };

  const [syncData, setSyncData] = useState<any>([]);
  const [syncName, setSyncName] = useState("");
  const [memberSearch, setMemberSearch] = useState([]);
  const [syncMemberArray, setSyncMemberArray] = useState([]);
  const [syncOwner, setSyncOwner] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const reqSyncData = await getSyncData(id);
        setSyncName(reqSyncData.syncName);
        setSyncData(reqSyncData);
        console.log(reqSyncData.syncMembers);
        setSyncOwner(reqSyncData.syncOwner);
        setSyncLeader(reqSyncData.syncOwner);
        setSyncMemberArray(reqSyncData.syncMembers);
        // console.log(syncData);

        const memberData = await getDocData("userDetails");
        // console.log(memberData);

        let membersName: any = [];

        let syncMembersUserDetails: any = [];

        memberData?.forEach((member: any) => {
          if (member.memberID !== auth.currentUser?.uid) {
            membersName.push({
              userName: member.userName,
              userEmail: member.userEmail,
              memberID: member.memberID,
            });
          }
          syncMembersUserDetails.push(member);
        });
        // console.log(typeof membersName);
        setMembers(
          syncMembersUserDetails
            .filter((member: any) =>
              reqSyncData.syncMembers
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
              !reqSyncData.syncMembers
                .map((member: any) => member.memberID)
                .includes(n.memberID || auth.currentUser?.uid)
          )
        );
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const [memberArray, setMemberArray] = useState<any>([]);

  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        // component="nav"
        sx={{
          display: "flex",
          width: "100%",
          borderBottom: "2px solid #dcdcdc",
          backgroundColor: "#f9f9f1",
          position: "fixed",

          flexDirection: "row",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          overflow: "auto",
          // zIndex: 1,
          // maxWidth: "%",
          // display: "flex",

          // mt: { xs: 4, sm: 4, md: 4 },
          // mr: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 },
          // flexGrow: 1,
          // p: 3,
          // width: { sm: `calc(100% - ${toolbarWidth}px)` },
          // maxWidth: "100%",
        }}
      >
        <Toolbar
          sx={{
            backgroundColor: "#f9f9f1",
            color: "black",
            display: "flex",
            width: "100%",
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
            {syncName}
          </Typography>
          <Button
            sx={{
              color: "white",
              backgroundColor: "#EE964B",
              ":hover": {
                backgroundColor: "#EE964B",
              },
            }}
            variant="contained"
            startIcon={<CallIcon />}
            onClick={() => navigate(`/Call`)}
          >
            Start Meeting
          </Button>
        </Toolbar>
      </Box>
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
            {/* {members.length > 1 && syncOwner === auth.currentUser?.uid && (
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
                          member.userName !== syncLeader) ||
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
                                auth.currentUser?.uid === syncOwner && (
                                  <MenuItem
                                    onClick={() =>
                                      handleMenuAction(
                                        "make admin",
                                        index,
                                        member.memberID
                                      )
                                    }
                                  >
                                    Make Admin
                                  </MenuItem>
                                )}
                              {member.role === "admin" &&
                                member.userName !== syncLeader &&
                                auth.currentUser?.uid === syncOwner && (
                                  <MenuItem
                                    onClick={() =>
                                      handleMenuAction(
                                        "remove admin",
                                        index,
                                        member.memberID
                                      )
                                    }
                                  >
                                    Remove Admin
                                  </MenuItem>
                                )}
                              {auth.currentUser?.uid === syncOwner && (
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
              Sub-Syncs
            </Typography>
            {subSyncs.length > 0 && ( // Only render the edit button if there are sub-syncs
              <EditIcon
                sx={{
                  color: "#EE964B",
                  fontSize: "25px",
                  cursor: "pointer",
                  ml: "40px",
                }}
                onClick={handleSubSyncEditToggle}
              />
            )}
            <AddBoxIcon
              sx={{
                color: "#EE964B",
                fontSize: "25px",
                cursor: "pointer",
              }}
              onClick={handleCreateSubSync}
            />
          </Box>
          <Divider />
          <Grid item xs={12} sm={12} md={6}>
            <Demo>
              {subSyncs.length === 0 ? (
                <Typography
                  variant="body1"
                  sx={{
                    color: "#05284C",
                    textAlign: "center",
                    p: 2,
                  }}
                >
                  Create a Sub-Sync
                </Typography>
              ) : (
                <List>
                  {subSyncs.map((subSync, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        isSubSyncEditMode && (
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
                              <MenuItem
                                onClick={() =>
                                  handleMenuAction("manage members", index, "")
                                }
                              >
                                Manage Members
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleDeleteSubSync(index)}
                              >
                                Delete Sub-Sync
                              </MenuItem>
                            </Menu>
                          </div>
                        )
                      }
                    >
                      <ListItemText
                        primary={subSync.name}
                        secondary={`Members: ${subSync.members
                          .map((member: any) => member.userName)
                          .join(", ")}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Demo>
          </Grid>
          <Divider />
        </Box>
      </Box>
      <Toolbar />
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
                color: "#EE964B",
              }}
              onClick={handleCancelDelete}
            >
              Cancel
            </Button>
            <Button
              sx={{
                color: "#EE964B",
              }}
              onClick={handleConfirmDeleteMember}
            >
              Remove
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isSubSyncDeleteConfirmationOpen}
          onClose={() => setSubSyncDeleteConfirmationOpen(false)} // Changed to setSubSyncDeleteConfirmationOpen(false)
        >
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this sub-sync?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSubSyncDeleteConfirmationOpen(false)}>
              Cancel
            </Button>{" "}
            {/* Changed to setSubSyncDeleteConfirmationOpen(false) */}
            <Button onClick={handleConfirmDeleteSubSync} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isAddMemberDialogOpen}
          onClose={() => setAddMemberDialogOpen(false)}
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "500px", // Set your width here
              },
            },
          }}
        >
          <DialogTitle>Sync Up!</DialogTitle>
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
            <Button onClick={() => setAddMemberDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember}>Add</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isCreateSubSyncDialogOpen}
          onClose={handleCancelCreateSubSync}
        >
          <DialogTitle>Create Sub-Sync</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Sub-Sync Name"
              fullWidth
              variant="outlined"
              value={subSyncName}
              onChange={handleSubSyncNameChange}
            />
            <TextField
              select
              label="Select Members"
              fullWidth
              variant="outlined"
              value={selectedMembers}
              onChange={handleMemberSelectChange}
              SelectProps={{
                multiple: true,
              }}
              sx={{ mt: 2 }}
            >
              {members.map((member, index) => (
                <MenuItem key={index} value={index}>
                  {member.userName}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelCreateSubSync}>Cancel</Button>
            <Button onClick={handleConfirmCreateSubSync}>Create</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isManageMembersDialogOpen}
          onClose={() => setManageMembersDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Manage Members</DialogTitle>
          <DialogContent>
            <Typography variant="h6">Remove Members from Sub-Sync:</Typography>
            <List>
              {subSyncs[selectedSubSyncIndex]?.members.map(
                (member, memberIndex) => (
                  <ListItem key={memberIndex}>
                    <ListItemText primary={member.userName} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() =>
                          handleRemoveMemberFromSubSync(memberIndex)
                        }
                      >
                        <ClearIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                )
              )}
            </List>
            <Divider />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Add Members to Sub-Sync:
            </Typography>
            {members.filter(
              ({ userName }) =>
                !subSyncs[selectedSubSyncIndex]?.members.some(
                  (member) => member.userName === userName
                )
            ).length === 0 && (
              <Typography variant="body1" sx={{ mt: 2 }}>
                All members from Sync exist in Sub-Sync.
              </Typography>
            )}
            {members
              .filter(
                ({ userName }) =>
                  !subSyncs[selectedSubSyncIndex]?.members.some(
                    (member) => member.userName === userName
                  )
              )
              .map((member, index) => (
                <List key={index}>
                  <ListItem>
                    <ListItemText primary={member.userName} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleAddMemberToSubSync(index)}
                      >
                        <AddIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              ))}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setManageMembersDialogOpen(false)}
              color="primary"
            >
              Close
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
        <Box component="main">
          <Tabs variant="fullWidth" value={tabValue} onChange={handleTabChange}>
            <Tab
              sx={{
                color: "#EE964B",
                fontWeight: "bold",
              }}
              label="Sync Chat"
            />
            <Tab
              sx={{
                color: "#EE964B",
                fontWeight: "bold",
              }}
              label="Sync Files"
            />
          </Tabs>
          {tabValue === 0 && (
            <Paper
              sx={{
                height: "100%",
                border: "1px solid #ccc",
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#05284C", fontWeight: "bold" }}
              >
                Sync Chat
              </Typography>
              {/* Add your Sync Chat content here */}
            </Paper>
          )}
          {tabValue === 1 && (
            <>
              <Paper
                sx={{
                  height: "100%",
                  border: "1px solid #ccc",
                  padding: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  display: "flex",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#05284C", fontWeight: "bold" }}
                >
                  Sync Files
                </Typography>
                {/* Add your Sync Files content here */}
              </Paper>
              <Header syncID={id || ""} />
              <FilesView syncID={id || ""} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// const NewWindow = ({ children, close }) => {
//   const newWindow = useMemo(
//     () =>
//       window.open(
//         "about:blank",
//         "newWin",
//         `width=400,height=300,left=${window.screen.availWidth / 2 - 200},top=${
//           window.screen.availHeight / 2 - 150
//         }`
//       ),
//     []
//   );
//   newWindow.onbeforeunload = () => {
//     close();
//   };
//   // useEffect(() => () => newWindow.close());
//   return createPortal(children, newWindow.document.body);
// };

export default SyncsPage;
