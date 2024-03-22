import SignIn from "./SignIn";
import { Box, Grid } from "@mui/material";

export default function Auth({ mainContent }: { mainContent: any }) {
  return (
    <Grid
      container
      sx={{
        height: {
          xs: "40vh",
          sm: "40vh",
          md: "100vh",
          lg: "100vh",
          xl: "100vh",
        },
      }}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={4}
        sx={{
          backgroundImage: "url('../src/assets/Logos/Logo white.png')",
          backgroundRepeat: "no-repeat",
          backgroundColor: "primary.main",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundOrigin: "content-box",
          pl: {
            xs: "0px",
            sm: "0px",
            md: "10%",
            lg: "10%",
            xl: "10%",
          },
          pr: {
            xs: "0px",
            sm: "0px",
            md: "10%",
            lg: "10%",
            xl: "10%",
          },
          minHeight: "10vh",
        }}
      />
      <Grid item xs={12} sm={12} md={8}>
        <Box sx={{ m: { xs: 2, sm: 5, md: 15 } }}>{mainContent}</Box>
      </Grid>
    </Grid>
  );
}
