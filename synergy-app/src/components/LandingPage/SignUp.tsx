import React, { useEffect } from "react";
import { useState } from "react";
import { auth } from "../../config/firebase";
import { db } from "../../config/firebase"; // Import the necessary package
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import { doc, setDoc } from "firebase/firestore"; // Import the necessary package
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./SignIn";

const SignUp = () => {
  // state variables
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordMatchErr, setPasswordMatchErr] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(dayjs().subtract(6, "year"));
  const [dateOfBirthErr, setDateOfBirthErr] = useState(false);
  const [checkedTandC, setCheckedTandC] = useState(false);
  const [checkedTandCErr, setCheckedTandCErr] = useState(false);
  const [usedEmail, setUsedEmail] = useState(false);

  const [userSignedIn, setUserSignedIn] = useState(false);
  const [role, setRole] = useState("general user");

  // const submit = (e: any) => {
  //   e.preventDefault();
  //   (db as any).collection("userDetails").add({ user });

  //   setName("");
  //   setPassword("");
  // };

  // useEffect to update passwordMatchErr

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserSignedIn(true);
        console.log("User is signed in");
        // getUserdetails(auth.currentUser?.uid);
      } else {
        setUserSignedIn(false);
        console.log("User is not signed in");
      }
    });
  });

  useEffect(() => {
    if (password !== passwordConfirm) {
      setPasswordMatchErr(true);
    } else {
      setPasswordMatchErr(false);
    }
  }, [password, passwordConfirm]);

  // Regex for email validation
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  // Function to Signin with email and password
  const SignUp = async () => {
    // Validating all inputs
    if (name === "") {
      setNameErr(true);
    } else {
      setNameErr(false);
    }
    if (email === "" || !emailRegex.test(email)) {
      setEmailErr(true);
    } else {
      setEmailErr(false);
    }
    if (password.length < 6) {
      setPasswordEmpty(true);
    } else {
      setPasswordEmpty(false);
    }
    if (dateOfBirth === dayjs("")) {
      setDateOfBirthErr(true);
    } else {
      setDateOfBirthErr(false);
    }
    if (!checkedTandC) {
      setCheckedTandCErr(true);
    } else {
      setCheckedTandCErr(false);
    }
    // Send sign in request if all inputs are valid
    if (
      !nameErr &&
      !emailErr &&
      !passwordEmpty &&
      !passwordMatchErr &&
      !dateOfBirthErr &&
      checkedTandC
    ) {
      //sign up
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        //creating firestore documents if signUp successful
        createUser();
      } catch (error) {
        if ((error as FirebaseError).code === "auth/email-already-in-use") {
          setUsedEmail(true);
        }
      }

      //sign in
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error(error);
      }
      console.log(auth.currentUser?.uid);
    }
  };

  //Function to create firestore documents for new users
  const createUser = async () => {
    const userId = auth.currentUser?.uid || ""; // Ensure userId is always a string
    try {
      const userDetails = {
        userName: name,
        userEmail: email,
        DOB: String(dateOfBirth.format("DD/MM/YYYY")),
        profilePic: "",
        userType: role,
      };

      await setDoc(doc(db, "userDetails", userId), userDetails);
    } catch (e) {
      console.error(e);
    }
    const userIdRef = doc(db, "userDetails", userId);
    try {
      const userData = {
        userId: userIdRef,
        syncID: [],
        chatID: [],
        projectID: [],
        EventID: [],
        taskID: [],
        brainBoardID: [],
        whiteBoardID: [],
        documentID: [],
        notificationID: [],
      };

      await setDoc(doc(db, "userData", userId), userData);
    } catch (e) {
      console.error(e);
    }
  };

  // Function to toggle password visibility
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setRole(event.target.value);
  };

  return (
    <>
      {/* <Routes>
        <Route path="/SignIn" element={<SignIn />} />
      </Routes> */}
      {/* Heading */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" align="left" color="primary">
          Welcome to Synergy!
        </Typography>
        <Typography variant="body1" align="left" color="secondary">
          Sign Up
        </Typography>
      </Box>
      {/* Box with everything else */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "100vh",
        }}
      >
        {/* Text Box for name */}
        <TextField
          required
          id="name"
          label="Name"
          variant="outlined"
          onChange={(e: any) => setName(e.target.value)}
          fullWidth
          error={nameErr} // Add the error prop here
          helperText={nameErr ? "Enter Your Name" : ""} // Add the helperText prop here
        />
        {/* Text Box for email */}
        <TextField
          required
          id="email"
          label="Email"
          variant="outlined"
          onChange={(e: any) => setEmail(e.target.value)}
          error={emailErr || usedEmail} // Add the error prop here
          helperText={
            emailErr
              ? "Enter a valid email"
              : usedEmail
              ? "Email already in use"
              : ""
          } // Add the helperText prop here
          fullWidth
          sx={{ mt: 3 }}
        />
        {/* Text Box for password */}
        <Box
          sx={{
            "&": {
              lg: {
                display: "flex",
                justifyContent: "space-between",
                // width: "auto",
                gap: "15px",
              },
              xl: {
                display: "flex",
                justifyContent: "space-between",
                // width: "auto",
                gap: "15px",
              },
            },
          }}
        >
          {/* Text Box for password */}
          <FormControl sx={{ mt: 3, width: "100%" }}>
            <InputLabel htmlFor="outlined-adornment-password">
              Password *
            </InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? "text" : "password"}
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
              label="Password *"
              onChange={(e) => setPassword(e.target.value)}
              error={passwordEmpty || passwordMatchErr}
            />
            <FormHelperText sx={{ color: "red" }}>
              {passwordEmpty
                ? "Enter a password (Greater than 6 charaters)"
                : ""}
            </FormHelperText>
          </FormControl>
          {/* Text Box for password confirmation */}
          <FormControl sx={{ mt: 3, width: "100%" }}>
            <TextField
              required
              error={passwordMatchErr || passwordEmpty}
              id="password-confirm"
              type={showPassword ? "text" : "password"}
              label="Confirm Password"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              helperText={passwordMatchErr ? "Password does not match" : ""}
            />
          </FormControl>
        </Box>

        <Box
          sx={{
            "&": {
              lg: {
                display: "flex",
                justifyContent: "space-between",
                // width: "auto",
                gap: "15px",
              },
              xl: {
                display: "flex",
                justifyContent: "space-between",
                // width: "auto",
                gap: "15px",
              },
            },
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ mt: 3, width: "100%" }}
              label="Date of Birth *"
              value={dateOfBirth}
              onChange={(newValue: any) => setDateOfBirth(newValue)}
              maxDate={dayjs().subtract(6, "year")}
            />
          </LocalizationProvider>

          <FormControl sx={{ mt: 3, width: "100%" }}>
            <InputLabel id="demo-simple-select-label">Role * </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={role}
              label="Role *"
              onChange={handleChange}
            >
              <MenuItem value={"student"}>Student</MenuItem>
              <MenuItem value={"general user"}>General User</MenuItem>
              <MenuItem value={"vocational educator"}>
                Vocational Educator
              </MenuItem>
              <MenuItem value={"advertising and business firms"}>
                Advertising and Business Firms
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        {/* Checkbox for terms and conditions */}
        <FormControl sx={{ mt: 3 }}>
          <FormControlLabel
            control={
              <>
                <Checkbox
                  required
                  checked={checkedTandC}
                  onChange={(e) => setCheckedTandC(e.target.checked)}
                  name="checkedTandC"
                />
              </>
            }
            label="I agree to the Terms and Conditions *"
          />
          <FormHelperText sx={{ color: "red" }}>
            {checkedTandCErr ? "Please agree to the terms and conditions" : ""}
          </FormHelperText>
        </FormControl>
        {/* Button for sign up */}
        <Button
          color="secondary"
          variant="contained"
          onClick={SignUp}
          sx={{ mt: 3, p: 1, width: "auto" }}
        >
          <Typography variant="button" color="white">
            Sign Up
          </Typography>
        </Button>
        <Box sx={{ display: "flex", justifyContent: "left", mt: 3 }}>
          <Typography variant="body1">{"Have an account?⠀"}</Typography>
          <Link to="/Auth/SignIn">
            <Typography
              variant="subtitle1"
              color="secondary"
              sx={{ cursor: "pointer", textIndent: 10 }}
            >
              Login Here
            </Typography>
          </Link>
        </Box>
        {userSignedIn ? <Navigate to="/MainPage" replace={true} /> : ""}
      </Box>
    </>
  );
};

export default SignUp;
