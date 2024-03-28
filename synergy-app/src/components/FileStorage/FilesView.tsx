import { Box, Divider, LinearProgress, Typography } from "@mui/material";
import File from "./File";
import { useEffect, useState } from "react";
import { db, storage } from "../../config/firebase";

import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import _ from "lodash";
import { deleteObject, ref } from "firebase/storage";

function FilesView(prop: { syncID: string }) {
  const [files, setFiles] = useState<any>(null);
  const syncId = prop.syncID;

  console.log(syncId);

  const getFiles = () => {
    const syncFilesCollectionRef = collection(db, "syncs", syncId, "syncFiles");
    const unsubscribe = onSnapshot(syncFilesCollectionRef, (snapshot) => {
      let fileArray: any = [];
      snapshot.forEach((file) => {
        fileArray.push({ ...file.data(), key: file.id });
      });
      setFiles(fileArray);
      console.log(fileArray);
    });
    return unsubscribe;
  };

  const getPathStorageFromUrl = (url: String) => {
    const baseUrl =
      "https://firebasestorage.googleapis.com/v0/b/drive-clone-49864.appspot.com/o/";
    let imagePath: string = url.replace(baseUrl, "");
    const indexOfEndPath = imagePath.indexOf("?");
    imagePath = imagePath.substring(0, indexOfEndPath);
    imagePath = imagePath.replace("%2F", "/");
    imagePath = imagePath.replace("%", " ");
    return imagePath;
  };

  useEffect(() => {
    getFiles();
    console.log(files);
  }, []);

  const deleteFile = async (id: string, url: string) => {
    const syncFiledocRef = doc(db, "syncs", syncId, "syncFiles", id);
    await deleteDoc(syncFiledocRef);
    const fileRef = ref(storage, getPathStorageFromUrl(url));

    // Delete the file
    deleteObject(fileRef)
      .then(() => {
        console.log("file deleted");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    // Top bar
    <>
      <Box
        sx={{
          justifyContent: "space-between",
          alignContent: "left",
          padding: "20px 0px 10px 2%",
          display: { xs: "none", sm: "none", md: "flex" },
        }}
      >
        <Typography>Name</Typography>
        <Typography>Date Created</Typography>
        <Typography
          sx={{ display: { xs: "none", sm: "none", md: "none", lg: "block" } }}
        >
          Type
        </Typography>
        <Typography
          sx={{ display: { xs: "none", sm: "none", md: "none", lg: "block" } }}
        >
          Uploaded By
        </Typography>
        <Box> </Box>
      </Box>
      <Divider />
      {/* the files */}
      <Box sx={{ overflow: "Hidden" }}>
        {files === null && <LinearProgress color="primary" />}

        {_.isEqual(files, []) && <Typography>No Files</Typography>}
        {files?.map((file: any) => (
          <File
            name={file.fileName}
            date={file.dateCreated}
            type={file.fileType}
            user={file.uploadedBy}
            URL={file.fileURL}
            key={file.key}
            mykey={file.key}
            deleteFile={() => {
              deleteFile(file.key, file.fileURL);
            }}
          />
        ))}
      </Box>
    </>
  );
}

export default FilesView;
