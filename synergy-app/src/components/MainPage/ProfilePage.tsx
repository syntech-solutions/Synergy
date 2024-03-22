// src/components/ProfilePage.js
import React from "react";
import { Avatar, Typography, Grid } from "@mui/material";

const ProfilePage = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Avatar alt="Profile Picture" src="/path/to/profile-picture.jpg" />
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography variant="h4">John Doe</Typography>
        <Typography variant="subtitle1">Web Developer</Typography>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac justo
          euismod, cursus libero vel, aliquam nunc.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ProfilePage;
