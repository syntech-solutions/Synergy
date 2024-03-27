import { Box, ToggleButton } from "@mui/material";
import Highlightable, { Range } from "Highlightable";
import { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { set } from "firebase/database";

interface IdeaProps {
  text: string;
  likes: number;
  highlight: string[];
  boardID: string;
  ideaID: string;
  color: string;
  addLikedBox: (ideaID: string, value: boolean) => void;
  addHighlight: (ideaID: string, value: string, range: any) => void;
  likedBool: any;
  highlightRange: any;
  highlightText: any;
}

const IdeaBox = ({
  text,
  likes,
  highlight,
  boardID,
  ideaID,
  color,
  addLikedBox,
  addHighlight,
  likedBool,
  highlightRange,
  highlightText,
}: IdeaProps) => {
  const [ideaLikes, setIdeaLikes] = useState<number>(likes);
  const [ideaText, setIdeaText] = useState<string>(text);

  let tempLiked = likedBool[ideaID] ? true : false;
  const [liked, setLiked] = useState<boolean>(tempLiked);

  let tempHighlight = highlightRange[ideaID]
    ? highlightRange[ideaID]
    : {
        start: -1,
        end: -1,
        text: "",
        data: {},
      };
  const [highlightedRange, setHighlightedRange] =
    useState<Range>(tempHighlight);

  let tempHighlightedText = highlightText[ideaID] ? highlightText : "";
  const [highlightedText, setHighlightedText] =
    useState<string>(tempHighlightedText);

  const [buttonPressed, setButtonPressed] = useState<boolean>(false);
  const [firstSend, setFirstSend] = useState<boolean>(true);

  // function to get the highlighted text and range
  const getHighlightedText = (text: string, range: Range) => {
    if (!liked) {
      setHighlightedRange(range);
      const highlighted = text.substring(range.start, range.end + 1);
      setHighlightedText(highlighted);
      addHighlight(ideaID, highlighted, range);
    }
  };

  // function to upload the idea to the database on liked or unliked
  const uploadIdeaToFirestore = async (text: string) => {
    let likes = ideaLikes;
    let fileDoc = {};

    let highlightArray = null;
    if (highlightedText != "") {
      if (liked) {
        highlightArray = [...highlight, highlightedText];
      } else {
        highlightArray = [...highlight].filter(
          (highlight) => highlight !== highlightedText
        );
      }
    }
    if (highlightedText === "") {
      highlightArray = highlight;
    }
    fileDoc = {
      idea: text,
      likes: ideaLikes,
      highlight: highlightArray,
      color: color,
    };
    const syncFilesCollectionRef = doc(
      db,
      "brainBoard",
      boardID,
      "ideas",
      ideaID
    );
    await updateDoc(syncFilesCollectionRef, fileDoc);
  };

  // const boxSize = () => {
  //   const size = ideaLikes * 20 + 200;
  //   const sizepixels = size + "px";
  //   return sizepixels;
  // };

  // function to update the idea to the database on liked or unliked
  useEffect(() => {
    if (firstSend) {
      setFirstSend(false);
    } else {
      uploadIdeaToFirestore(ideaText);
    }
  }, [buttonPressed]);

  return (
    <Box
      sx={{
        p: "30px",
        backgroundColor: color,
        margin: "20px",
        borderRadius: "10px",
        fontWeight: "bold",
        display: "inline-block",
        verticalAlign: "top",
      }}
    >
      <Box
        sx={{
          pb: "20px",
          overflow: "hidden",
          overflowWrap: "break-word",
          height: "",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <Highlightable
          ranges={[highlightedRange as Range]}
          enabled={true}
          onTextHighlighted={(range) => {
            getHighlightedText(ideaText, range);
          }}
          id={"idea-box-1"}
          onMouseOverHighlightedWord={() => {}}
          highlightStyle={{
            backgroundColor: "#fbf719",
          }}
          text={ideaText}
          style={{}}
        />
      </Box>
      <ToggleButton
        value="Heart"
        selected={liked}
        onChange={() => {
          if (liked) {
            setIdeaLikes(ideaLikes - 1);
          } else {
            setIdeaLikes(ideaLikes + 1);
          }
          setLiked(!liked);
          addLikedBox(ideaID, !liked);
          setButtonPressed(!buttonPressed);
        }}
        sx={{ position: "relative", bottom: "0px", right: "10px" }}
      >
        {ideaLikes}
        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </ToggleButton>
    </Box>
  );
};

export default IdeaBox;
