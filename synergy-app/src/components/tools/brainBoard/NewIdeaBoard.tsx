import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../config/firebase";
import IdeaBoard from "./IdeaBoard";
import { Box, Button, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

const brainBoardCollectionRef = collection(db, "brainBoard");
let brainBoardDocRef = null;

interface NewIdeaBoardProps {
  sendSocketMessage: any;
  changeToolType: any;
  changeToolID: any;
  showTool: any;
  changePressedToolButton: any;
  callID: string;
  userID: string;
}
const NewIdeaBoard = ({
  sendSocketMessage,
  changeToolType,
  changeToolID,
  showTool,
  changePressedToolButton,
  callID,
  userID,
}: NewIdeaBoardProps) => {
  const [boardID, setBoardID] = useState("");
  const [boardName, setBoardName] = useState("");
  const [loading, setLoading] = useState(false);
  const [allBrainBoards, setAllBrainBoards] = useState([]);

  const makeBoard = async (text: string) => {
    setLoading(true);
    console.log("making board");
    const ideaDoc = {
      boardName: text,
      hostID: userID,
    };
    brainBoardDocRef = await addDoc(brainBoardCollectionRef, ideaDoc);
    console.log(brainBoardDocRef.id);
    setBoardID(brainBoardDocRef.id);
    setLoading(false);
    changeToolType("brainBoard");
    changeToolID(brainBoardDocRef.id);
    sendSocketMessage("brainBoard", brainBoardDocRef.id);
  };

  useEffect(() => {
    const fetchBrainBoardDocs = async () => {
      try {
        const querySnapshot = await getDocs(
          query(brainBoardCollectionRef, where("hostID", "==", userID))
        );
        const docs = querySnapshot.docs.map((doc) => {
          setAllBrainBoards((prev) => [...prev, { id: doc.id, ...doc.data() }]);
        });
        console.log(docs);
      } catch (error) {
        console.error("Error fetching brain board docs:", error);
      }
    };

    fetchBrainBoardDocs();
  }, []);
  const deleteBoard = async (id: string) => {
    try {
      await deleteDoc(doc(db, "brainBoard", id));
      setAllBrainBoards((prev) => prev.filter((board) => board.id !== id));
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  const openBoard = (id: string) => {
    setBoardID(id);
    setLoading(false);
    changeToolType("brainBoard");
    changeToolID(id);
    sendSocketMessage("brainBoard", id);
  };
  return (
    <>
      {boardID === "" ? (
        <>
          <Box
            sx={{
              width: "100vw-10px",
              backgroundColor: "#EE964B",
              p: "10px",
            }}
          >
            <Typography variant="h5">Brain Board - {boardName}</Typography>
            <Box
              sx={{
                display: "flex",
                columnGap: "10px",
                rowGap: "10px",
                alignItems: "left",
                flexWrap: "wrap",
                p: "10px",
              }}
            >
              <TextField
                value={boardName}
                onChange={(e) => {
                  setBoardName(e.target.value);
                }}
                sx={{ backgroundColor: "white", borderRadius: "8px" }}
              ></TextField>
              <LoadingButton
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                onClick={() => makeBoard(boardName)}
                sx={{ backgroundColor: "#05284C" }}
              >
                Create Board
              </LoadingButton>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              overflow: "auto",
              maxHeight: "600px",
              width: "100vw",
            }}
          >
            {/*  */}
            {allBrainBoards.map((board) => (
              <Box
                sx={{
                  width: "180px",
                  height: "130px",
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  justifyItems: "center",
                  backgroundColor: "#EE964B",
                  mt: "40px",
                  ml: "40px",
                  borderRadius: "6px",
                  overflow: "hidden",
                  textWrap: "wrap",
                  flexDirection: "column",
                }}
                key={board.id}
              >
                <Box
                  onClick={() => {
                    openBoard(board.id);
                  }}
                  sx={{
                    width: "100%",
                    height: "100%",
                    "&:hover": {
                      cursor: "pointer",
                      backgroundColor: "#c47b3d",
                    },
                    textOverflow: " clip",
                    textWrap: "nowrap",
                  }}
                >
                  <Typography variant="h6" sx={{ m: "30px" }}>
                    {board.boardName}
                  </Typography>
                </Box>
                <Box
                  onClick={() => {
                    deleteBoard(board.id);
                  }}
                  sx={{
                    m: "10px",
                    color: "#05284C",
                    "&:hover": {
                      cursor: "pointer",
                      color: "#965e2d",
                    },
                  }}
                >
                  <DeleteIcon />
                </Box>
              </Box>
            ))}
          </Box>
        </>
      ) : (
        <IdeaBoard boardId={boardID} boardName={boardName} />
      )}
    </>
  );
};

export default NewIdeaBoard;
