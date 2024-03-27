import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import GlobalStyles from "@mui/material/GlobalStyles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/system/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import {
  Autocomplete,
  CardActionArea,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, auth, storage } from "../../config/firebase";
import { useEffect } from "react";
import CreateSync from "./CreateSync";
import { getDocData, getUserSyncData } from "../getFunctions";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import { Label } from "@mui/icons-material";

// TODO remove, this demo shouldn't need to reset the theme.
document.body.style.backgroundColor = "#f9f9f1";

const defaultTheme = createTheme();

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: alpha(theme.palette.common.white, 1.0),
  marginRight: theme.spacing(2),
  width: "100%",
  maxWidth: "300px",
  minWidth: "200px",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

export default function ProjectsView() {
  const [open, setOpen] = React.useState(false);
  //   const [imgURL, setImgURL] = React.useState(
  //     "https://firebasestorage.googleapis.com/v0/b/synergy-75d4a.appspot.com/o/Logo.png?alt=media&token=81f29e27-e8fd-4cb4-9c00-f083a1cc199a"
  //   );

  const [createdProject, setCreatedProject] = useState<any>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createNewProject = async (newProjForm) => {
    const newProjRef = doc(collection(db, "projects"));

    try {
      await setDoc(newProjRef, newProjForm);
    } catch (e) {
      console.log(e);
    }

    newProjForm.syncMembers.forEach(async (member: any) => {
      const memberSyncRef = doc(db, "userData", member.memberID);

      try {
        const userDataSyncDetails = {
          syncName: newProjForm.syncName,
          syncImage: newProjForm.syncImage,
        };
        await updateDoc(memberSyncRef, {
          [`projectID.${newProjRef.id}`]: userDataSyncDetails,
        });
      } catch (e) {
        console.log(e);
      }
    });

    setCreatedProject(true);
  };

  const [memberSearch, setMemberSearch] = useState([]);

  const [syncData, setSyncData] = useState<any>([]);

  const [projectOwner, setProjectOwner] = useState<any>([]);

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
              role: "member",
            });
          } else if (member.memberID === auth.currentUser?.uid) {
            const projectOwner = {
              userName: member.userName,
              userEmail: member.userEmail,
              memberID: member.memberID,
              role: "admin",
            };
            // membersName.push(projectOwner);
            setProjectOwner(projectOwner);
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
        const userSyncData = await getUserSyncData(auth.currentUser?.uid || "");

        let projectDataArray: any = [];

        // userSyncData?.syncId.forEach((sync: any) => {
        //   projectDataArray.push(sync);
        // });

        for (const [id, record] of Object.entries(userSyncData?.projectID)) {
          projectDataArray.push([id, record]);
        }

        setSyncData(projectDataArray);
        setCreatedProject(false);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [createdProject]);

  const navigate = useNavigate();

  const [memberArray, setMemberArray] = useState<any>([]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <AppBar
        component="div"
        position="static"
        color="default"
        elevation={4}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
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
            variant="h5"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1, minWidth: "90px" }}
          >
            Projects
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Syncs…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          mt: { xs: 4, sm: 4, md: 4 },
          mr: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 },
        }}
      >
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          sx={{
            backgroundColor: "#EE964B",
            color: "white",
            "&:hover": {
              backgroundColor: "#EE964B",
              color: "white",
            },
            fontSize: "1em",
          }}
          onClick={handleClickOpen}
        >
          New Sync
        </Button>
      </Box>
      <div style={{ width: "100%", flexGrow: 1, overflow: "auto" }}>
        {syncData?.map((sync: any) => (
          <Box
            sx={{
              display: "inline-flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "50px",
              mt: { xs: 5, sm: 5, md: 5 },
              ml: { xs: 8, sm: 8, md: 8, lg: 8, xl: 8 },
              mb: { xs: 5, sm: 5, md: 5 },
            }}
            onClick={() => {
              navigate("/Syncs/" + sync[0]);
            }}
          >
            <Card key={sync[0]} sx={{ width: "300px" }}>
              <CardActionArea>
                {/* <CardMedia
                  component="img"
                  height="140"
                  image={sync[1].syncImage}
                  alt="Sync Image"
                /> */}
                <CardContent
                  sx={{
                    backgroundColor: "#EE964B",
                    color: "white",
                  }}
                >
                  <Typography variant="h5" component="div">
                    {sync[1].syncName}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            memberArray.push(projectOwner);

            formJson.syncMembers = memberArray.map((member: any) => {
              return { role: member.role, memberID: member.memberID };
            });
            // formJson.syncImage = imgURL;
            formJson.projectOwner = auth.currentUser?.uid;
            createNewProject(formJson);
            handleClose();
          },
        }}
      >
        <DialogTitle>Create New Sync</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="projectName"
            label="Project Name"
            type="projectName"
            fullWidth
          />
          <Autocomplete
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create New Sync</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
