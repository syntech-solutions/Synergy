import * as React from "react";
import Title from "./Title";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SyncIcon from "@mui/icons-material/Sync";
import Button from "@mui/material/Button";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { auth, db } from "../../config/firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Chart() {
  // const userId1 = auth.currentUser?.uid || "";
  const [array, setArray] = useState<any>([
    [0, ["Sync 0"]],
    [1, ["Sync 1"]],
    [2, ["Sync 2"]],
    [3, ["Sync 3"]],
  ]);
  // const [userId, setUserId] = useState(userId1);

  // const userId = auth.currentUser?.uid || "";
  // console.log(userId);

  const getSync = () => {
    // Ensure userId is always a string
    // const userId = auth.currentUser?.uid || "";

    // const userData = await getDoc(doc(db, "userData", userId)).then((snapshot) => {

    // });
    // const syncArray: string[] = [];

    // const colRef = doc(db, "userData", userId);

    // const userDoc = await getDoc(colRef);
    // for (const [id, record] of Object.entries(userDoc.data()?.syncId)) {
    //   syncArray.push(record[0]);
    // }

    const syncDocRef = doc(db, "userData", auth.currentUser?.uid || "");

    const unsubscribe = onSnapshot(syncDocRef, (doc) => {
      let syncArray: any = [];
      // snapshot.forEach((sync) => {
      //   syncArray.push({ ...sync.data(), key: sync.id });
      //   console.log(sync.id);
      // });
      for (const [id, record] of Object.entries(doc.data()?.syncId)) {
        syncArray.push([id, record]);
      }
      // setArray({ ...doc.data(), key: doc.id });
      console.log(syncArray);

      setArray(syncArray);
    });

    return unsubscribe;
  };

  // getSync();
  useEffect(() => {
    getSync();
    console.log(array);
  }, []);

  // getSync();

  //   getSync();
  //   console.log(array);
  //   let syncArray: string[] = [];
  //   //   console.log(syncArray);
  // useEffect(() => {
  //   const syncArray = getSync();
  //   // const syncArray = array.sort();
  // }, []);

  const navigate = useNavigate();

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title>Recent Syncs</Title>
        <Button
          sx={{
            width: "150px",
            color: "#05284C",
            borderColor: "#EE964B",
            ":hover": {
              backgroundColor: "#EE964B",
              color: "white",
            },
          }}
          variant="outlined"
          endIcon={<NavigateNextIcon />}
          onClick={() => navigate("/MainPage/Syncs")}
        >
          Syncs Page
        </Button>
      </Box>
      {/*  */}
      <div style={{ width: "100%", flexGrow: 1, overflow: "auto" }}>
        {array?.map((sync: any) => (
          <Box
            key={sync.key}
            sx={{
              width: "100%",
              height: "180px",
              maxWidth: "180px",
              background: "#EE964B",
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "25px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/Syncs/" + sync[0]);
            }}
          >
            <SyncIcon
              sx={{
                color: "white",
                fontSize: "70px",
                paddingBottom: "10px",
              }}
            />
            <Typography
              sx={{
                color: "white",
                fontSize: "20px",
              }}
            >
              {sync[1][0]}
            </Typography>
          </Box>
        ))}
      </div>
    </React.Fragment>
  );
}
