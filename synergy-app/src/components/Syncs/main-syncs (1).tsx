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

// const docRef = doc(db, "userDetails");
// const docSnap = await getDoc(docRef);

// if (docSnap.exists()) {
//   console.log("Document data:", docSnap.data());
// } else {
//   // docSnap.data() will be undefined in this case
//   console.log("No such document!");
// }

export default function MainSyncs() {
  // const [openDialog, setOpenDialog] = React.useState(false);

  // const handleBoxClick = () => {
  //   setOpenDialog(true);
  // };

  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  // };

  const [open, setOpen] = React.useState(false);
  const [imgURL, setImgURL] = React.useState(
    "https://firebasestorage.googleapis.com/v0/b/synergy-75d4a.appspot.com/o/Logo.png?alt=media&token=81f29e27-e8fd-4cb4-9c00-f083a1cc199a"
  );

  const [createdSync, setCreatedSync] = useState<any>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    console.log("Clicking Choose file");
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    // Create a storage reference
    const storageRef = ref(storage, `syncImage/${file?.name}`);

    // Upload the file
    try {
      const snapshot = await uploadBytesResumable(storageRef, file);
      console.log(snapshot);
    } catch (e) {
      console.log(e);
    }

    // Get the download URL
    try {
      const url = await getDownloadURL(storageRef);
      setImgURL(url);
      console.log(url);
    } catch (e) {
      console.log(e);
    }

    // Post image inside the db

    // setOpen(false);
    setFile(null);

    // Get metadata
    // try {
    //   const metadata = await getMetadata(storageRef);
    //   console.log(metadata.size);
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const createNewSync = async (newSyncForm) => {
    const newSyncRef = doc(collection(db, "syncs"));

    try {
      await setDoc(newSyncRef, newSyncForm);
    } catch (e) {
      console.log(e);
    }

    newSyncForm.syncMembers.forEach(async (member: any) => {
      const memberSyncRef = doc(
        db,
        "userData",
        member.memberID
        // "syncId",
        // newSyncRef.id
      );

      try {
        const userDataSyncDetails = {
          syncName: newSyncForm.syncName,
          syncImage: newSyncForm.syncImage,
        };
        await updateDoc(memberSyncRef, {
          [`syncID.${newSyncRef.id}`]: userDataSyncDetails,
        });
      } catch (e) {
        console.log(e);
      }
    });

    const userSyncRef = doc(db, "userData", auth.currentUser?.uid || "");

    try {
      const userDataSyncDetails = {
        syncName: newSyncForm.syncName,
        syncImage: newSyncForm.syncImage,
      };
      await updateDoc(userSyncRef, {
        [`syncID.${newSyncRef.id}`]: userDataSyncDetails,
      });
    } catch (e) {
      console.log(e);
    }

    setCreatedSync(true);
  };

  const [memberSearch, setMemberSearch] = useState([]);
  const [array, setArray] = useState<string[]>([]);

  const [syncData, setSyncData] = useState<any>([]);

  useEffect(() => {
    (async () => {
      try {
        const memberData = await getDocData("userDetails");
        // console.log(memberData);

        let membersName: any = [];

        memberData?.forEach((member: any) => {
          if (member.memberID !== auth.currentUser?.uid) {
            membersName.push({
              userName: member.userName,
              userEmail: member.userEmail,
              memberID: member.memberID,
            });
          }
        });
        console.log(membersName);

        setMemberSearch(membersName);
        // console.log(memberSearch);
      } catch (err) {
        console.log("Error occured when fetching members list");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const userSyncData = await getUserSyncData(auth.currentUser?.uid || "");
        console.log(typeof userSyncData?.syncID);

        let syncDataArray: any = [];

        // userSyncData?.syncId.forEach((sync: any) => {
        //   syncDataArray.push(sync);
        // });

        for (const [id, record] of Object.entries(userSyncData?.syncID)) {
          syncDataArray.push([id, record]);
        }

        setSyncData(syncDataArray);
        console.log(syncDataArray);
        setCreatedSync(false);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [createdSync]);

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
        <Toolbar>
          <Typography
            variant="h5"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1, minWidth: "90px" }}
          >
            Syncs
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
                <CardMedia
                  component="img"
                  height="140"
                  image={sync[1].syncImage}
                  alt="Sync Image"
                />
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
            console.log(memberArray);
            formJson.syncMembers = memberArray;
            formJson.syncImage = imgURL;
            formJson.syncOwner = auth.currentUser?.uid;
            console.log(formJson);
            createNewSync(formJson);
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
            name="syncName"
            label="Sync Name"
            type="syncName"
            fullWidth
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="desc"
            name="syncDesc"
            label="Sync Description"
            type="syncDesc"
            fullWidth
          />
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
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleChange}
          />
          <Button onClick={handleUpload}>Upload Sync Image</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create New Sync</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
