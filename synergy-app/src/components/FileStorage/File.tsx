import { useState } from "react";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { ReactComponentElement } from "react";
interface FileProps {
  name: string;
  date: Timestamp;
  type: string;
  user: string;
  URL: string;
  mykey: string;
  deleteFile: (name: string, url: string) => void;
}

const File = ({
  name,
  date,
  type,
  user,
  URL,
  mykey,
  deleteFile,
}: FileProps) => {
  return (
    <Box>
      <Box
        sx={{
          margin: "10px",
          width: "100% - 20px",

          display: { md: "flex", sm: "block" },
          alignContent: "left",
          padding: {
            md: "15px 0px 15px 2%",
            sm: "15px 10% 40px 2%",
            xs: "15px 10% 40px 2%",
          },
          "&:hover": { cursor: "pointer", backgroundColor: "lightgrey" },
          borderRadius: "10px",
        }}
        onClick={() => window.open(URL)}
      >
        <Typography sx={{ wrap: "wrap", overflow: "hidden", maxWidth: "30%" }}>
          {name}
        </Typography>
        <Box
          sx={{
            position: "absolute",
            ml: { sm: "0%", md: "23%" },
            display: "flex",
          }}
        >
          <Typography sx={{ display: { md: "none", sm: "block" } }}>
            Created:{" "}
          </Typography>
          <Typography sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
            {date?.toDate().toDateString()}
          </Typography>
          <Typography
            sx={{ display: { xs: "block", sm: "block", md: "none" } }}
          >
            {date?.toDate().toLocaleDateString()}
          </Typography>
        </Box>
        <Typography
          sx={{
            position: "absolute",
            ml: { xs: "37%", sm: "37%", md: "49%" },
            overflow: "hidden",
            width: "20%",
            wrap: "nowrap",
            maxHeight: "20px",
          }}
        >
          {type.includes("image")
            ? type.substring(6).toUpperCase()
            : type.includes("pdf")
            ? "PDF"
            : type.includes("document")
            ? "Document"
            : "File"}
        </Typography>
        <Typography
          sx={{ position: "absolute", ml: { xs: "60%", sm: "60%", md: "72%" } }}
        >
          {user}
        </Typography>
      </Box>
      <Box
        sx={{
          position: "absolute",
          ml: { xs: "70%", sm: "70%", md: "85%" },
          mt: "-55px",
        }}
      >
        {" "}
        <Button onClick={() => deleteFile(mykey, URL)}>Delete</Button>
      </Box>
    </Box>
  );
};

export default File;
