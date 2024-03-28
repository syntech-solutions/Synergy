import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import RecentSyncs from "./RecentSyncs";
import Events from "./Events";
import RecentTasks from "./RecentTasks";

document.body.style.backgroundColor = "#f9f9f1";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#f9f9f1",
          height: "100%",
          width: "100%",
        }}
      >
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: "#f9f9f1",
            flexGrow: 1,
            height: "100%",
            width: "100%",
            overflow: "auto",
          }}
        >
          <Box sx={{ margin: "30px", maxWidth: "100" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "auto",
                    minHeight: "330px",
                    maxHeight: "450px",
                    width: "100%",
                  }}
                >
                  <RecentSyncs />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: "auto",
                    minHeight: "330px",
                    maxHeight: "450px",
                  }}
                >
                  <Events />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: "auto",
                    minHeight: "330px",
                    // maxHeight: "450px",
                  }}
                >
                  <RecentTasks />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
