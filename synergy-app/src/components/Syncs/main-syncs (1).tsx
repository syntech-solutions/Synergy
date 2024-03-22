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
  CardActionArea,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../config/firebase";
import { useEffect } from "react";
import CreateSync from "./CreateSync";

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

export default function MainSyncs() {
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleBoxClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [array, setArray] = useState<string[]>([]);

  const getSync = () => {
    // Ensure userId is always a string
    // const userId = auth.currentUser?.uid || "";

    // const userData = await getDoc(doc(db, "userData", userId)).then((snapshot) => {

    // });
    // const syncArray: string[] = [];

    // const colRef = doc(db, "userData", userId);

    // const userDoc = await getDoc(colRef);
    // for (const [id, record] of Object.entries(userDoc.data()?.syncId)) {
    //   syncArray.push(record[0]);
    // }

    const syncDocRef = doc(db, "userData", auth.currentUser?.uid || "");

    const unsubscribe = onSnapshot(syncDocRef, (doc) => {
      let syncArray: any = [];
      // snapshot.forEach((sync) => {
      //   syncArray.push({ ...sync.data(), key: sync.id });
      //   console.log(sync.id);
      // });
      for (const [id, record] of Object.entries(doc.data()?.syncId)) {
        syncArray.push([id, record]);
      }
      // setArray({ ...doc.data(), key: doc.id });
      console.log(syncArray);

      setArray(syncArray);
    });

    return unsubscribe;
  };

  // getSync();
  useEffect(() => {
    getSync();
    console.log(array);
  }, []);

  const navigate = useNavigate();

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
          onClick={handleBoxClick}
        >
          New Sync
        </Button>
      </Box>
      <div style={{ width: "100%", flexGrow: 1, overflow: "auto" }}>
        {array?.map((sync: any) => (
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
                  image={sync[1][1]}
                  alt="Sync Image"
                />
                <CardContent
                  sx={{
                    backgroundColor: "#EE964B",
                    color: "white",
                  }}
                >
                  <Typography variant="h5" component="div">
                    {sync[1][0]}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </div>
      {/* <CreateSyncDialog /> */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>New Sync</DialogTitle>
        <DialogContent>
          <DialogContentText>Create a new sync.</DialogContentText>
          <CreateSync />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleBoxClick}>
            Create Sync
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
