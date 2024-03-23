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
import SyncIcon from "@mui/icons-material/Sync";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import routes from "../../routes/Routes";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
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

export default function SyncMain() {
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleBoxClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [selectedPage, setSelectedPage] = useState();

  function handleClick(selectedSync: any) {
    // setSelectedPage(selectedSync);
    setSelectedPage(selectedSync);
    if (selectedSync === "dummyId") {
      console.log(selectedSync);
      return <Navigate to="dummySync" replace={true} />;
    }
  }

  const [array, setArray] = useState<string[]>([]);

  const getSyncNameArray = async () => {
    try {
      const userId = auth.currentUser?.uid || ""; // Ensure userId is always a string
      // const userData = await getDoc(doc(db, "userData", userId)).then((snapshot) => {

      // });
      const syncArrayName: string[] = [];

      const colRef = doc(db, "userData", userId);

      const userDoc = await getDoc(colRef);
      for (const [id, record] of Object.entries(userDoc.data()?.syncID)) {
        syncArrayName.push(record[0]);
      }

      setArray(syncArrayName);
      //   console.log(syncArrayName);
      return syncArrayName;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const navigate = useNavigate();

  getSyncNameArray();
  const syncArray = array.sort();

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
        elevation={1}
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
          // maxWidth: '100vh',
          display: "flex",
          justifyContent: {
            xs: "center",
            sm: "center",
            md: "left",
            lg: "left",
            xl: "left",
          },
          flexWrap: "wrap",
          gap: "50px",
          mt: { xs: 8, sm: 8, md: 8 },
          ml: { xs: 0, sm: 0, md: 8, lg: 8, xl: 8 },
        }}
      >
        {/* <Box
          sx={{
            width: "100%",
            height: "220px",
            maxWidth: "250px",
            background: "#EE964B",
            boxShadow: "1px 1px 4px 1px rgba(0, 0, 0, 0.25)",
            display: "inline-block",
          }}
          onClick={() => handleClick("dummyId")}
        >
          <SyncIcon
            sx={{
              position: "absolute",
              width: "80px",
              height: "80px",
              margin: "35px 0 0 85px", // Use margins instead of absolute positioning
              color: "#FFFFFF",
            }}
          />

          <Typography
            sx={{
              width: "150px",
              height: "100px",
              margin: "130px 0 0 52px", // Use margins instead of absolute positioning
              color: "#FFFFFF",
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            Welcome to Syncs!
          </Typography>
        </Box> */}
        <div style={{ width: "100%", flexGrow: 1, overflow: "auto" }}>
          {syncArray.map((text, index) => (
            <Box
              key={text}
              sx={{
                width: "100%",
                height: "220px",
                maxWidth: "250px",
                background: "#EE964B",
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "25px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/Syncs/" + text);
              }}
            >
              <SyncIcon
                sx={{
                  color: "white",
                  fontSize: "70px",
                  paddingBottom: "10px",
                }}
              />

              <Typography
                sx={{
                  color: "white",
                  fontSize: "20px",
                }}
              >
                {text}
              </Typography>
            </Box>
          ))}
        </div>
        <Box
          sx={{
            width: "100%",
            height: "220px",
            maxWidth: "250px",
            background: "#EE964B",
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "25px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleBoxClick}
        >
          <AddIcon
            sx={{
              position: "absolute",
              width: "110px",
              height: "110px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#FFFFFF",
            }}
          />
        </Box>
      </Box>
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
