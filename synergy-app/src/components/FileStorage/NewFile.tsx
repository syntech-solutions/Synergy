import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import "../../styles/NewFile.css";

import {
  getDownloadURL,
  getMetadata,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage, db } from "../../config/firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const NewFile = () => {
  const classes = useStyles();

  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    setUploading(true);

    // Create a storage reference
    const storageRef = ref(storage, `files/${file?.name}`);

    // Upload the file
    try {
      const snapshot = await uploadBytesResumable(storageRef, file);
      console.log(snapshot);
    } catch (e) {
      console.log(e);
    }

    // Get the download URL
    try {
      const url = await getDownloadURL(storageRef);
      console.log(url);
    } catch (e) {
      console.log(e);
    }

    // Post image inside the db
    try {
      await addDoc(collection(db, "myFiles"), {
        timestamp: serverTimestamp(),
        caption: file?.name,
        fileUrl: url,
        size: snapshot.bytesTransferred,
      });
    } catch (e) {
      console.log(e);
    }

    setUploading(false);
    setOpen(false);
    setFile(null);

    // Get metadata
    try {
      const metadata = await getMetadata(storageRef);
      console.log(metadata.size);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="newFile">
      <div className="newFile__container" onClick={handleOpen}>
        <AddIcon />
        <p>New</p>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <p>Select files you want to upload!</p>
          {uploading ? (
            <p>Uploading...</p>
          ) : (
            <>
              <input type="file" onChange={handleChange} />
              <button onClick={handleUpload}>Upload</button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default NewFile;
