/**
 * Sign-in component for the application.
 * Allows users to sign in using email and password or with Google.
 */
import React from "react";
import { useState } from "react";
import { auth, provider } from "../../config/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { db } from "../../config/firebase"; // Import the necessary package
import { FirebaseError } from "@firebase/util";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Import the necessary package
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import SignUp from "./SignUp";
// import { getUserdetails } from "../getFunctions";

const SignIn = () => {
  // state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginError, setLoginError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [userSignedIn, setUserSignedIn] = useState(false);

  // Function to toggle password visibility
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  //Function to create user document if not found in firestore
  const createUserDocument = async (userId: any) => {
    //check if user exists in firestore
    try {
      const ref = doc(db, "userDetails", userId);
      const userDoc = await getDoc(ref);
    } catch (error) {
      // if ((error as FirebaseError).code === "") {

      // }
      console.log(error);
    }
  };

  // Function to Signin with email and password
  const signIn = async () => {
    console.log(auth.currentUser?.uid);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      // console.error(error);
      setLoginError(true);
    }
  };
  // Funtion to sign in with google
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setLoginError(true);
    } finally {
    }
  };
  //runs when the component is mounted and checks if the user is signed in or not
  //subscribed to the auth state to start listening for changes
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserSignedIn(true);
        console.log("User is signed in");
        createUserDocument(auth.currentUser?.uid);
        // getUserdetails(auth.currentUser?.uid);
      } else {
        setUserSignedIn(false);
        console.log("User is not signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  let navigate = useNavigate();
  return (
    <>
      {/* Box with the top text */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" align="left" color="primary">
          Welcome back to Synery!
        </Typography>
        <Typography variant="body1" align="left" color="secondary">
          Sign into your account
        </Typography>
      </Box>
      {/* Box with everything else */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Text feild for email */}
        <TextField
          error={loginError}
          id="outlined-basic"
          label="Email"
          variant="outlined"
          onChange={(e: any) => setEmail(e.target.value)}
          fullWidth
        />
        {/* <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ mt: 3 }}
        /> */}
        {/* Password Feild */}
        <FormControl sx={{ mt: 3 }}>
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            error={loginError}
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  edge="end"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormHelperText sx={{ color: "red" }}>
            {loginError ? "Invaild Email or Password" : ""}
          </FormHelperText>
        </FormControl>
        {/* Checkbox for remember me and forgot password */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "auto",
            mt: 3,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="Remember me"
          />
          <Typography
            variant="body1"
            align="right"
            color="secondary"
            sx={{ mt: 1, cursor: "pointer" }}
          >
            Forgot password?
          </Typography>
        </Box>
        {/* Button for login and login with google */}
        <Button
          color="secondary"
          variant="contained"
          sx={{ mt: 3, p: 1, width: "auto" }}
          onClick={signIn}
        >
          <Typography variant="button" color="white">
            Login
          </Typography>
        </Button>
        <Button
          variant="outlined"
          onClick={signInWithGoogle}
          sx={{
            bgcolor: "white",
            mt: 3,
            p: 1,
            width: "auto",
            borderColor: "#cfcfcf",
          }}
        >
          <GoogleIcon fontSize="small" sx={{ m: "auto 7px auto 0" }} />
          <Typography variant="button">Login with Google</Typography>
        </Button>
        {/* Text for sign up */}
        <Box sx={{ display: "flex", justifyContent: "left", mt: 3 }}>
          <Typography variant="body1">{"Don't have an account ?⠀"}</Typography>
          {/* <Routes>
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/SignUp" element={<SignUp />} />
          </Routes> */}
          <Link to="/Auth/SignUp">
            <Typography
              variant="subtitle1"
              color="secondary"
              sx={{ cursor: "pointer" }}
              // onClick={() => <Navigate to="/SignIn" replace={true} />}
            >
              Sign Up here
            </Typography>
          </Link>
        </Box>
        {/* {userSignedIn ? (
          <Button
            variant="outlined"
            onClick={() => signOut(auth)}
            sx={{
              bgcolor: "white",
              mt: 3,
              p: 1,
              width: "auto",
              borderColor: "#cfcfcf",
            }}
          >
            <Typography variant="button">Sign Out</Typography>
          </Button>
        ) : (
          ""
        )} */}
        {userSignedIn ? <Navigate to="/MainPage" replace={true} /> : ""}
      </Box>
    </>
  );
};

export default SignIn;
