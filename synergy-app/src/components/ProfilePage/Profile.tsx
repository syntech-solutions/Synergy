//Website color scheme
//#EE964B
//#F9F9F1
//#05284C

import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
  IconButton,
  Paper,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";
import { auth, db, storage } from "../../config/firebase";
import { getUserDetails } from "../getFunctions";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import { doc, collection, setDoc, updateDoc } from "firebase/firestore";
import { useRef } from "react";

document.body.style.backgroundColor = "#F9F9F1";

const Profile = () => {
  let userJson = {
    userName: "",
    userAbout: "",
    userCompany: "",
    userType: "",
    userSkills: "",
    profilePic: "",
  };

  const updateUserRef = doc(db, "userDetails", auth.currentUser?.uid || "");

  const [name, setName] = useState("User Name");
  const [email, setEmail] = useState("User Email");
  const [about, setAbout] = useState("About me");
  const [company, setCompany] = useState("Company/School name");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("Your Skills");
  const [profilePic, setProfilePic] = useState("");
  const [editModePersonal, setEditModePersonal] = useState(false);
  const [editModeProfessional, setEditModeProfessional] = useState(false);
  const [editModePhoto, setEditModePhoto] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempAbout, setTempAbout] = useState(about);
  const [tempCompany, setTempCompany] = useState(company);
  const [tempRole, setTempRole] = useState(role);
  const [tempSkills, setTempSkills] = useState(skills);
  const [tempProfilePicture, setTempProfilePicture] = useState("");
  const [imgFile, setImgFile] = useState("");
  const [imgURL, setImgURL] = useState("");

  const handleNameChange = (e: any) => setTempName(e.target.value);
  // const handleEmailChange = (e: any) => setTempEmail(e.target.value);
  const handleAboutChange = (e: any) => setTempAbout(e.target.value);
  const handleCompanyChange = (e: any) => {
    setTempCompany(e.target.value);
    console.log(tempCompany);
  };
  const handleRoleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setRole(event.target.value);
  };
  const handleSkillsChange = (e: any) => {
    setTempSkills(e.target.value);
    console.log(tempSkills);
  };
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputFileRef.current?.click();
  };
  const handleChange = (event: any) => {
    const file = event.target.files ? event.target.files[0] : null;
    console.log(file);
    setImgFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setTempProfilePicture(event.target.result as string);
        } else {
          setTempProfilePicture(""); // Provide a default value here
        }
      };
      reader.readAsDataURL(file);
    }

    // Now you can send 'file' to a server, read its contents, etc.
  };

  const handleProfilePictureChange = (e: any) => {
    // handleChange(e);
    // console.log("handleProfilePictureChange");
    // if (e.target.files[0]) {
    //   setImgFile(e.target.files[0]);
    //   console.log("handleProfilePictureChange", imgFile);
    //   const reader = new FileReader();
    //   reader.onload = (event) => {
    //     if (event.target) {
    //       setTempProfilePicture(event.target.result as any);
    //     }
    //   };
    //   reader.readAsDataURL(imgFile);
    // }
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempProfilePicture(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditPhoto = () => setEditModePhoto(true);
  const handleCancelPhoto = () => setEditModePhoto(false);
  const handleSavePhoto = async () => {
    if (tempProfilePicture) {
      console.log("Uploading profile picture:", tempProfilePicture);
      const storageRef = ref(storage, `profileImg/${imgFile?.name}`);

      try {
        const snapshot = await uploadBytesResumable(storageRef, imgFile);
        console.log(snapshot);
      } catch (e) {
        console.log(e);
      }

      // Get the download URL
      try {
        const url = await getDownloadURL(storageRef);
        setImgURL(url);
        console.log(url);
        await updateDoc(updateUserRef, {
          profilePic: url,
        });
        setProfilePic(url);
      } catch (e) {
        console.log(e);
      }

      // try {
      //   console.log(imgURL);
      //   await updateDoc(updateUserRef, {
      //     profilePic: imgURL,
      //   });
      // } catch (e) {
      //   console.log(e);
      // }
    }
    setEditModePhoto(false);
    // console.log("imgURL", imgURL);
    // setProfilePic(imgURL);
  };

  const handleEditPersonal = () => setEditModePersonal(true);
  const handleCancelPersonal = () => {
    setTempName(name);
    setTempEmail(email);
    setTempAbout(about);
    setEditModePersonal(false);
  };
  const handleSavePersonal = async () => {
    setName(tempName);
    // setEmail(tempEmail);
    setAbout(tempAbout);
    userJson.userName = tempName;
    userJson.userAbout = tempAbout;

    try {
      const updatedUserDetails = {
        userName: userJson.userName,
        userAbout: userJson.userAbout,
      };
      await updateDoc(updateUserRef, updatedUserDetails);
    } catch (error) {
      console.log(error);
    }

    setEditModePersonal(false);
  };

  const handleEditProfessional = () => setEditModeProfessional(true);
  const handleCancelProfessional = () => {
    setTempCompany(company);
    setTempRole(role);
    setTempSkills(skills);
    setEditModeProfessional(false);
  };
  const handleSaveProfessional = async () => {
    setCompany(tempCompany);
    setRole(tempRole);
    setSkills(tempSkills);

    userJson.userCompany = tempCompany;
    userJson.userType = role;
    userJson.userSkills = tempSkills;

    try {
      const updatedUserDetails = {
        userCompany: userJson.userCompany,
        userType: userJson.userType,
        userSkills: userJson.userSkills,
      };
      // console.log(updatedUserDetails);
      await updateDoc(updateUserRef, updatedUserDetails);
    } catch (error) {
      console.log(error);
    }
    setEditModeProfessional(false);
  };

  const handleDeleteProfile = () => {
    // Logic to delete the profile goes here
    alert("Profile deleted!");
  };

  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const userSyncData = await getUserDetails(auth.currentUser?.uid || "");
        // console.log(userSyncData.userEmail);
        setName(userSyncData?.userName || tempName);
        setEmail(userSyncData?.userEmail || tempEmail);
        setAbout(userSyncData?.userAbout || tempAbout);
        setCompany(userSyncData?.userCompany || tempCompany);
        setRole(userSyncData?.userType || tempRole);
        setTempRole(userSyncData?.userType || tempRole);
        setSkills(userSyncData?.userSkills || tempSkills);
        setProfilePic(userSyncData?.profilePic || tempProfilePicture);

        console.log("UseEffect", profilePic);

        // setTempName(userSyncData?.userName || "");
        // setTempEmail(userSyncData?.userEmail || "");

        // userSyncData?.syncId.forEach((sync: any) => {
        //   syncDataArray.push(sync);
        // });

        setProfileData(userSyncData ? userSyncData : {});
        // console.log(profileData);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#EE964B",
          p: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Profile Settings
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            mt: 4,
            ml: 4,
            mr: 4,
            mb: 2,
            width: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: -2,
            }}
          >
            <Typography variant="h6" sx={{ color: "#05284C" }} gutterBottom>
              Your Photo
            </Typography>
            <Box>
              {editModePhoto ? (
                <>
                  <Button
                    variant="contained"
                    onClick={handleSavePhoto}
                    sx={{
                      mr: -3,
                      backgroundColor: "#EE964B",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#EE964B",
                      },
                      ml: 3,
                    }}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <IconButton
                  sx={{
                    mr: -2,
                  }}
                  onClick={handleEditPhoto}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>
          </Box>

          <Box display="flex" alignItems="center">
            <Box
              sx={{
                alignItems: "center",
              }}
            >
              {editModePhoto ? (
                <>
                  <Avatar
                    alt="Profile Picture"
                    src={tempProfilePicture || ""}
                    sx={{ width: 180, height: 180, mt: 2 }}
                  />
                  <Stack>
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      id="profile-picture-upload"
                      ref={inputFileRef}
                      style={{ display: "none" }}
                      onChange={handleChange}
                    />
                    <Button
                      sx={{
                        backgroundColor: "#EE964B",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#EE964B",
                        },
                        width: "180px",
                        textAlign: "center",
                        mt: 3,
                      }}
                      variant="contained"
                      onClick={
                        handleClick
                        // () => {
                        //   let element = document.getElementById(
                        //     "profile-picture-upload"
                        //   );
                        //   if (element) {
                        //     element.click();
                        //   }
                        // }
                        // document.getElementById("profile-picture-upload").click()
                      }
                      component="label"
                    >
                      Upload Picture
                      {/* <input
                        id="profile-picture-upload"
                        type="file"
                        accept="image/png, image/jpeg"
                        hidden
                        onChange={handleProfilePictureChange}
                      /> */}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleCancelPhoto}
                      sx={{
                        backgroundColor: "#EE964B",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#EE964B",
                        },
                        width: "180px",
                        textAlign: "center",
                        mt: 1,
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </>
              ) : (
                <Avatar
                  alt="Profile Picture"
                  src={profilePic || ""}
                  sx={{ width: 180, height: 180, mt: 2 }}
                />
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
      <Box
        sx={{
          m: 4,
        }}
      >
        <Typography
          sx={{
            mb: 3,
          }}
          variant="h6"
        >
          Your Information
        </Typography>
        <Paper elevation={3} sx={{ p: 5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              mt: -2,
              width: "auto",
            }}
          >
            <Typography variant="h6" sx={{ color: "#05284C" }}>
              Personal Information
            </Typography>
            <Box>
              {editModePersonal ? (
                <>
                  <Button
                    variant="contained"
                    onClick={handleSavePersonal}
                    sx={{
                      mr: 2,
                      backgroundColor: "#EE964B",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#EE964B",
                      },
                      mb: 4,
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancelPersonal}
                    sx={{
                      backgroundColor: "#05284C",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#05284C",
                      },
                      mb: 4,
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <IconButton
                  sx={{
                    mr: -2,
                  }}
                  onClick={handleEditPersonal}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>
          </Box>
          <Typography variant="body1" gutterBottom>
            {editModePersonal ? (
              <TextField
                fullWidth
                placeholder={tempName}
                onChange={handleNameChange}
              />
            ) : (
              name
            )}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {email}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {editModePersonal ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder={tempAbout}
                onChange={handleAboutChange}
              />
            ) : (
              about
            )}
          </Typography>
        </Paper>
      </Box>
      <Paper elevation={3} sx={{ p: 5, m: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            mt: -2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#05284C" }}>
            Professional Information
          </Typography>
          <Box>
            {editModeProfessional ? (
              <>
                <Button
                  variant="contained"
                  onClick={handleSaveProfessional}
                  sx={{
                    mr: 2,
                    backgroundColor: "#EE964B",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#EE964B",
                    },
                    mb: 4,
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancelProfessional}
                  sx={{
                    backgroundColor: "#05284C",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#05284C",
                    },
                    mb: 4,
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <IconButton
                sx={{
                  mr: -2,
                }}
                onClick={handleEditProfessional}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        <Typography variant="body1" gutterBottom>
          {editModeProfessional ? (
            <TextField
              fullWidth
              placeholder={tempCompany}
              onChange={handleCompanyChange}
            />
          ) : (
            company
          )}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {editModeProfessional ? (
            // <TextField
            //   fullWidth
            //   placeholder={tempRole}
            //   onChange={handleRoleChange}
            // />
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={role}
              // label="Role *"
              onChange={handleRoleChange}
              placeholder={tempRole}
              fullWidth
              defaultValue={role}
            >
              <MenuItem value={"Student"}>Student</MenuItem>
              <MenuItem value={"General User"}>General User</MenuItem>
              <MenuItem value={"Vocational Educator"}>
                Vocational Educator
              </MenuItem>
              <MenuItem value={"Advertising and Business Firms"}>
                Advertising and Business Firms
              </MenuItem>
            </Select>
          ) : (
            role
          )}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {editModeProfessional ? (
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder={tempSkills}
              onChange={handleSkillsChange}
            />
          ) : (
            skills
          )}
        </Typography>
      </Paper>
      <Box
        display="flex"
        justifyContent="flex-end"
        sx={{
          m: 4,
        }}
      >
        <Button
          onClick={handleDeleteProfile}
          variant="text"
          sx={{
            backgroundColor: "#05284C",
            color: "white",
            "&:hover": {
              backgroundColor: "#05284C",
            },
          }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Profile
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
