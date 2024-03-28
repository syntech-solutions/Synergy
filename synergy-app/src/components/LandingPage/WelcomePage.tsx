import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Navigate, useNavigate } from "react-router-dom";
import routes from "../../routes/Routes";
import landingbg from "../../assets/landingbg.png";

const WelcomePage = () => {
  // const [selectedPage, setSelectedPage] = useState();
  // function handleClick(selectedOption: any) {
  //   console.log(selectedOption);
  //   setSelectedPage(selectedOption);
  // if (selectedOption === "SignUp") return <Navigate to="/SignUp" />;
  // else return <Navigate to="/SignIn" />;

  let navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 2,
        backgroundImage: `url(${landingbg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          backgroundColor: "white",
          borderRadius: "25px",
          padding: "70px",
        }}
      >
        <Box
          sx={{
            backgroundImage: "url('../src/assets/Logos/Logo blue.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundOrigin: "content-box",
            height: "300px",
            width: "300px",
          }}
        ></Box>

        <Typography variant="h3" component="div" gutterBottom>
          Welcome to Synergy
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/Auth/SignIn")}
        >
          Sign In
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/Auth/SignUp")}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );

  // } else if (selectedPage === "SignIn") navigate("/SignIn");
  // // return <Navigate to="/SignIn" replace={true} />;
  // else if (selectedPage === "SignUp") navigate("/SignUp");
  // // return <Navigate to="/SignUp" replace={true} />;
};

export default WelcomePage;
