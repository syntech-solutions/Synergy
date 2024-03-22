import * as React from "react";
import Title from "./Title";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Grid } from "@mui/material";
import Tasks from "./Tasks";
import { useState } from "react";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [array, setArray] = useState<string[]>([]);

  const getTaskNameArray = async () => {
    try {
      const userId = auth.currentUser?.uid || ""; // Ensure userId is always a string
      // const userData = await getDoc(doc(db, "userData", userId)).then((snapshot) => {

      // });
      const taskArrayName: string[] = [];

      const colRef = doc(db, "userData", userId);

      const userDoc = await getDoc(colRef);
      for (const [id, record] of Object.entries(userDoc.data()?.taskId)) {
        taskArrayName.push(record);
      }
      // console.log(taskArrayName);

      setArray(taskArrayName);
      //   console.log(taskArrayName);
      return taskArrayName;
    } catch (e) {
      console.error(e);
      return [];
    }
  };
  //   console.log(taskArrayName);

  getTaskNameArray();
  const taskArray = array.sort();

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
        <Title>Your Tasks</Title>
        <Button
          sx={{
            width: "180px",
            color: "#05284C",
            borderColor: "#EE964B",
            ":hover": {
              backgroundColor: "#EE964B",
              color: "white",
            },
          }}
          variant="outlined"
          endIcon={<NavigateNextIcon />}
          onClick={() => navigate("/MainPage/Projects")}
        >
          Projects Page
        </Button>
      </Box>
      {/* <div style={{ width: "100%", flexGrow: 1, overflow: "hidden" }}></div> */}
      <Grid item xs={12} sm={12} md={12}>
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
          }}
        >
          {taskArray.map((array, index) => (
            <Tasks task={array[0]} project={array[1]} dueDate={array[2]} />
          ))}
          {/* <Tasks task="Task Name" project="Project Name" dueDate="DD/MM/YYYY" /> */}
          {/* <Tasks task="Task Name" project="Project Name" dueDate="DD/MM/YYYY" /> */}
        </Box>
      </Grid>
    </React.Fragment>
  );
}
