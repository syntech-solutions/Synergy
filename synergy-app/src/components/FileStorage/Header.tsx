import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { db, storage } from "../../config/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import LoadingButton from "@mui/lab/LoadingButton";
import SyncIcon from "@mui/icons-material/Sync";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
} from "firebase/firestore";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import FilesView from "../filesView/FilesView";
import { Refresh } from "@mui/icons-material";

let storageRef: any;
let fileURL: string;

const Header = (prop: { syncID: string }) => {
  const [uploading, setUploading] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const syncID = prop.syncID;

  const uploadFileToStorageToStorage = async (file: any) => {
    storageRef = ref(storage, `${syncID}/${file.name + uuidv4()}`);
    setUploading(true);
    await uploadBytes(storageRef, file).then((snapshot) => {});
  };

  const getFileURL = async () => {
    console.log("getting url");
    const url = await getDownloadURL(storageRef);
    fileURL = url;
    console.log("got url");
    console.log(fileURL);
  };

  const uploadFileToFirestore = async (file: any) => {
    await getFileURL();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const fileDoc = {
      uploadedBy: "user",
      dateCreated: serverTimestamp(),
      fileType: file.type,
      fileName: file.name,
      folderContent: [],
      fileURL: fileURL,
    };
    const syncFilesCollectionRef = collection(db, "syncs", syncID, "syncFiles");
    console.log("adding document");
    await addDoc(syncFilesCollectionRef, fileDoc);
    console.log("document added");
  };

  const handleFileUpload = async (event: any) => {
    if (event.target.files[0] != null) {
      console.log("upoloading file");
      await uploadFileToStorageToStorage(event.target.files[0]);
      console.log("file uploaded");
      try {
        console.log("upload to firestore");
        await uploadFileToFirestore(event.target.files[0]);
      } catch (error) {
        console.log(error);
      }
      setUploading(false);
      fileURL = "";
    }
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <>
      <Box
        sx={{
          width: "100vh-10px",
          backgroundColor: "orange",
          p: "10px",
          sticky: "top",
        }}
      >
        <LoadingButton
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          loading={uploading}
          loadingPosition="start"
        >
          Upload file
          <VisuallyHiddenInput
            type="file"
            onChange={(event) => handleFileUpload(event)}
          />
        </LoadingButton>
      </Box>
    </>
  );
};

export default Header;
