import ChatPeople from "../PeopleMain/ChatPeople";
import Chat from "../PeopleMain/Chat";

import React, { useState } from "react";
import { Box, Grid, Paper } from "@mui/material";

export default function PeopleMain() {
  return (
    <>
      <Grid container spacing={0}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={4}
          xl={4}
          sx={{ height: "100vh" }}
        >
          <ChatPeople></ChatPeople>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={8}
          xl={8}
          sx={{ height: "100vh" }}
        >
          <Box sx={{ p: { xs: 2, sm: 2, md: 2 }, height: "100vh" }}>
            <Chat></Chat>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
