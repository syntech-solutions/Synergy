import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../config/firebase";
import Header from "./Header";
import {
  Box,
  Button,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import IdeaBox from "./IdeaBox";
import { get, set } from "firebase/database";

interface IdeaBoardProps {
  boardId: string;
  boardName: string;
}
const IdeaBoard = ({ boardId, boardName }: IdeaBoardProps) => {
  const [ideasList, setIdeasList] = useState<
    | {
        idea: string;
        likes: number;
        highlight: string[];
        key: string;
        color: string;
        likesArray: string[];
      }[]
    | null
  >(null);
  const boardID = boardId;
  const [newText, setNewText] = useState("");
  const [highlightedRange, setHighlightedRange] = useState({});
  const [highlightedText, setHighlightedText] = useState({});
  const [likedBox, setLikedBox] = useState({});

  // function to pass the child components to update the state likedBox to keep track of the liked ideas
  const addLikedBox = (ideaID: string, value: boolean) => {
    setLikedBox({ ...likedBox, [ideaID]: value });
  };
  // function to pass the child components to update the state highlightedRange and highlightedText to keep track of the highlighted ideas
  const addHighlight = (ideaID: string, value: string, range: any) => {
    setHighlightedText({ ...highlightedText, [ideaID]: value });
    setHighlightedRange({ ...highlightedRange, [ideaID]: range });
  };

  // function to get the ideas from the database
  const getBoard = () => {
    const syncFilesCollectionRef = collection(
      db,
      "brainBoard",
      boardID,
      "ideas"
    );
    const unsubscribe = onSnapshot(syncFilesCollectionRef, (snapshot) => {
      let ideaArray: any = [];
      snapshot.forEach((file) => {
        ideaArray.push({ ...file.data(), key: file.id });
      });
      setIdeasList([...ideaArray]);
    });

    return unsubscribe;
  };
  // function to generate a random color for the ideas
  const randomColor = () => {
    const colours = ["#f7ecba", "#f7d6ba", "#f7bae4", "#bae4f7", "#d2edce"];
    return colours[Math.floor(Math.random() * colours.length)];
  };
  // function to create an idea
  const createIdea = async (text: string) => {
    const fileDoc = {
      idea: text,
      likes: 0,
      highlight: [],
      color: randomColor(),
    };

    const syncFilesCollectionRef = collection(
      db,
      "brainBoard",
      boardID,
      "ideas"
    );
    await addDoc(syncFilesCollectionRef, fileDoc);
    setNewText("");
  };

  // getting the board from the database
  useEffect(() => {
    getBoard();
    console.log(boardID);
  }, []);
  useEffect(() => {
    console.log(ideasList);
  }, [ideasList]);
  // const ideaSize = (likes: number) => {
  //   return likes * 30 + 250;
  // };

  return (
    <>
      <Box sx={{ position: "fixed", width: "100%", zIndex: "1" }}>
        <Header boardName={boardName} ideasArray={ideasList} />
        <Box
          sx={{
            backgroundColor: "#EE964B",
            display: "flex",
          }}
        >
          {" "}
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Add Idea"
            sx={{
              backgroundColor: "white",
              m: "10px 0px 10px  20px",
              borderRadius: "8px 0px 0px 8px",
              maxWidth: "1000px",
            }}
          ></TextField>
          <Button
            variant="contained"
            onClick={() => {
              newText != "" ? createIdea(newText) : console.error("No text");
            }}
            sx={{ m: "10px 20px 10px 0px", backgroundColor: "#05284C" }}
          >
            <Typography noWrap sx={{ minWidth: "90px" }}>
              Add Idea
            </Typography>
          </Button>
        </Box>
      </Box>

      {ideasList === null && <LinearProgress color="primary" />}
      <Box
        sx={{
          pt: "200px",
          overflow: "auto",
          maxHeight: "600px",
        }}
      >
        {ideasList != null &&
          ideasList?.map((ideaDoc) => (
            <IdeaBox
              key={JSON.stringify(ideaDoc)}
              text={ideaDoc?.idea}
              likes={ideaDoc?.likes}
              highlight={ideaDoc?.highlight}
              boardID={boardID}
              ideaID={ideaDoc.key}
              color={ideaDoc.color}
              addHighlight={addHighlight}
              addLikedBox={addLikedBox}
              likedBool={likedBox}
              highlightRange={highlightedRange}
              highlightText={highlightedText}
            />
          ))}
      </Box>
    </>
  );
};

export default IdeaBoard;
