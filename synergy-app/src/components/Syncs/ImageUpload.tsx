import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function ImageUploadDialog() {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [tempProfilePicture, setTempProfilePicture] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    // Here you can handle the upload process (e.g., send the file to a server)
    console.log(selectedFile);
    handleClose();
  };

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

  return (
    <div>
      <Button
        variant="outlined"
        onClick={
          () => {
            let element = document.getElementById("profile-picture-upload");
            if (element) {
              element.click();
            }
          }
          // document.getElementById("profile-picture-upload").click()
        }
        component="label"
      >
        Upload Image
        <input
          id="profile-picture-upload"
          type="file"
          hidden
          onChange={handleProfilePictureChange}
        />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload Image</DialogTitle>
        <DialogContent>
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpload}>Upload</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ImageUploadDialog;
