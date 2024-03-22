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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

document.body.style.backgroundColor = "#F9F9F1";

const Profile = () => {
  const [name, setName] = useState("User Name");
  const [email, setEmail] = useState("User Email");
  const [about, setAbout] = useState("About me");
  const [company, setCompany] = useState("Company/School name");
  const [role, setRole] = useState("Role");
  const [skills, setSkills] = useState("Your Skills");
  const [editModePersonal, setEditModePersonal] = useState(false);
  const [editModeProfessional, setEditModeProfessional] = useState(false);
  const [editModePhoto, setEditModePhoto] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempAbout, setTempAbout] = useState(about);
  const [tempCompany, setTempCompany] = useState(company);
  const [tempRole, setTempRole] = useState(role);
  const [tempSkills, setTempSkills] = useState(skills);
  const [tempProfilePicture, setTempProfilePicture] = useState(null);

  const handleNameChange = (e: any) => setTempName(e.target.value);
  const handleEmailChange = (e: any) => setTempEmail(e.target.value);
  const handleAboutChange = (e: any) => setTempAbout(e.target.value);
  const handleCompanyChange = (e: any) => setTempCompany(e.target.value);
  const handleRoleChange = (e: any) => setTempRole(e.target.value);
  const handleSkillsChange = (e: any) => setTempSkills(e.target.value);
  const handleProfilePictureChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setTempProfilePicture(event.target.result as any);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditPhoto = () => setEditModePhoto(true);
  const handleSavePhoto = () => {
    if (tempProfilePicture) {
      console.log("Uploading profile picture:", tempProfilePicture);
    }
    setEditModePhoto(false);
  };

  const handleEditPersonal = () => setEditModePersonal(true);
  const handleCancelPersonal = () => {
    setTempName(name);
    setTempEmail(email);
    setTempAbout(about);
    setEditModePersonal(false);
  };
  const handleSavePersonal = () => {
    setName(tempName);
    setEmail(tempEmail);
    setAbout(tempAbout);
    setEditModePersonal(false);
  };

  const handleEditProfessional = () => setEditModeProfessional(true);
  const handleCancelProfessional = () => {
    setTempCompany(company);
    setTempRole(role);
    setTempSkills(skills);
    setEditModeProfessional(false);
  };
  const handleSaveProfessional = () => {
    setCompany(tempCompany);
    setRole(tempRole);
    setSkills(tempSkills);
    setEditModeProfessional(false);
  };

  const handleDeleteProfile = () => {
    // Logic to delete the profile goes here
    alert("Profile deleted!");
  };

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
              <Avatar
                alt="Profile Picture"
                src={tempProfilePicture || ""}
                sx={{ width: 180, height: 180, mt: 2 }}
              />
              {editModePhoto && (
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
                    () => {
                      let element = document.getElementById(
                        "profile-picture-upload"
                      );
                      if (element) {
                        element.click();
                      }
                    }
                    // document.getElementById("profile-picture-upload").click()
                  }
                  component="label"
                >
                  Upload Picture
                  <input
                    id="profile-picture-upload"
                    type="file"
                    hidden
                    onChange={handleProfilePictureChange}
                  />
                </Button>
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
            {editModePersonal ? (
              <TextField
                fullWidth
                placeholder={tempEmail}
                onChange={handleEmailChange}
              />
            ) : (
              email
            )}
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
            <TextField
              fullWidth
              placeholder={tempRole}
              onChange={handleRoleChange}
            />
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
