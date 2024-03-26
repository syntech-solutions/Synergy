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
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { getUserSyncData } from "../getFunctions";
import axios from "axios";
import Loader from "react-loader-spinner";

export default function RecentSyncs() {
  // const userId1 = auth.currentUser?.uid || "";
  // const [userId, setUserId] = useState(userId1);

  // const userId = auth.currentUser?.uid || "";
  // console.log(userId);

  // const getSync = () => {
  //   // Ensure userId is always a string
  //   // const userId = auth.currentUser?.uid || "";

  //   // const userData = await getDoc(doc(db, "userData", userId)).then((snapshot) => {

  //   // });
  //   // const syncArray: string[] = [];

  //   // const colRef = doc(db, "userData", userId);

  //   // const userDoc = await getDoc(colRef);
  //   // for (const [id, record] of Object.entries(userDoc.data()?.syncId)) {
  //   //   syncArray.push(record[0]);
  //   // }

  //   const syncDocRef = doc(db, "userData", auth.currentUser?.uid || "");

  //   const unsubscribe = onSnapshot(syncDocRef, (doc) => {
  //     let syncArray: any = [];
  //     // snapshot.forEach((sync) => {
  //     //   syncArray.push({ ...sync.data(), key: sync.id });
  //     //   console.log(sync.id);
  //     // });
  //     for (const [id, record] of Object.entries(doc.data()?.syncId)) {
  //       syncArray.push([id, record]);
  //     }
  //     // setArray({ ...doc.data(), key: doc.id });
  //     console.log(syncArray);

  //     setArray(syncArray);
  //   });

  //   return unsubscribe;
  // };

  // getSync();
  // useEffect(() => {
  //   getSync();
  //   console.log(array);
  // }, []);

  const [syncData, setSyncData] = useState<any>([]);

  const [isLoading, setLoading] = useState(true);
  const [singlePackage, setPackage] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5173/MainPage/Dashboard").then((response) => {
      setPackage(response.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const userSyncData = await getUserSyncData(auth.currentUser?.uid || "");
        // console.log(typeof userSyncData?.syncID);

        let syncDataArray: any = [];

        // userSyncData?.syncId.forEach((sync: any) => {
        //   syncDataArray.push(sync);
        // });

        for (const [id, record] of Object.entries(userSyncData?.syncID)) {
          syncDataArray.push([id, record]);
        }

        setSyncData(syncDataArray);
        // console.log(syncDataArray);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [isLoading]);

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
  if (!isLoading) {
    return (
      <>
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
          {syncData?.map((sync: any) => (
            // <Box
            //   key={sync.key}
            //   sx={{
            //     width: "100%",
            //     height: "180px",
            //     maxWidth: "180px",
            //     background: "#EE964B",
            //     display: "inline-flex",
            //     flexDirection: "column",
            //     alignItems: "center",
            //     justifyContent: "center",
            //     margin: "25px",
            //     borderRadius: "5px",
            //     cursor: "pointer",
            //   }}
            //   onClick={() => {
            //     navigate("/Syncs/" + sync[0]);
            //   }}
            // >
            //   <SyncIcon
            //     sx={{
            //       color: "white",
            //       fontSize: "70px",
            //       paddingBottom: "10px",
            //     }}
            //   />
            //   <Typography
            //     sx={{
            //       color: "white",
            //       fontSize: "20px",
            //     }}
            //   >
            //     {sync[1][0]}
            //   </Typography>
            // </Box>
            <Box
              sx={{
                display: "inline-flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "50px",
                mt: { xs: 2, sm: 2, md: 2 },
                ml: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
                mb: { xs: 2, sm: 2, md: 2 },
              }}
              onClick={() => {
                navigate("/Syncs/" + sync[0]);
              }}
            >
              <Card key={sync[0]} sx={{ width: "300px" }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={sync[1].syncImage}
                    alt="Sync Image"
                  />
                  <CardContent
                    sx={{
                      backgroundColor: "#EE964B",
                      color: "white",
                    }}
                  >
                    <Typography variant="h5" component="div">
                      {sync[1].syncName}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </div>
      </>
    );
  } else {
    return <CircularProgress />; // Loading spinner
  }
}
