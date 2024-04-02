import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  IconButton,
  Pagination,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import OpenAI from "openai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";

interface HeaderProps {
  boardName: string;
  ideasArray: any;
}

const Header = ({ boardName, ideasArray }: HeaderProps) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [openai, setOpenAI] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showCompileBox, setShowCompileBox] = useState(false);
  const [compileBoxContent, setCompileBoxContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [heading, setHeading] = useState("Summary"); // New state for the heading
  const [compileLoading, setCompileLoading] = useState(false);
  const [pptLoading, setPPTLoading] = useState(false);
  const [socket, setSocket] = useState(io("http://localhost:4004"));

  const apiKey = ""; // Your OpenAI API key
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("join-room", "a", "brainboard");
      console.log("Connected to server");
    });
    socket.on("disconnect", () => {});
  }, [socket]);

  // Initialize OpenAI instance with dangerouslyAllowBrowser set to true
  if (!openai) {
    setOpenAI(new OpenAI({ apiKey, dangerouslyAllowBrowser: true }));
  }

  const sendMessage = async (message, paginate = false) => {
    // Send user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, isUser: true },
    ]);

    // Call ChatGPT API
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      });

      const botReply = response.choices[0].message.content.trim();
      socket?.emit("send-message", "a", botReply);
      if (paginate) {
        // Divide the response into 5 pages
        const pageSize = Math.ceil(botReply.length / 5);
        const pages = [];
        for (let i = 0; i < botReply.length; i += pageSize) {
          pages.push(botReply.slice(i, i + pageSize));
        }
        setCompileBoxContent(pages);
        setCurrentPage(1);
        setTotalPages(pages.length);
      } else {
        // Display the response as a single paragraph
        setCompileBoxContent([botReply]);
        setCurrentPage(1);
        setTotalPages(1);
      }

      // Update messages with bot reply
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botReply, isUser: false },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  socket?.on("send-message", (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, isUser: false },
    ]);
    setCompileBoxContent([message]);
    setShowCompileBox(true);
    setHeading("Summary");
    console.log(message);
  });

  const handleCompileButtonClick = async () => {
    setCompileLoading(true);
    await sendMessage(
      `I will give you an array of json objects with 
      some ideas each idea has likes and highlighted 
      segments prioritize the highlighted (A highlighted 
        segment means one user only liked that part of 
        the idea, a highlight is linked to a like) 
        and liked parts and give me a new idea which 
        incorporates the liked parts of the ideas and 
        ignore the not liked parts of the ideas in the 
        array,dont just list down the liked ideas 
        but develop a new idea which incorporates 
        the most liked and highlighted parts and 
        disregard ideas with low or no likes, dont show 
        me parts of the ideas just give your new idea 
        in atleast 60 words. Do not include ideas with 0 likes` +
        JSON.stringify(ideasArray) +
        `just give me the summary and no other text and 
        dont show likes, dont mention array, likes or highlights.`,
      false
    );
    setShowCompileBox(true); // Show the compile box when the button is clicked
    setHeading("Summary"); // Change the heading to "Summary"
    setCompileLoading(false);
  };

  const handleToPPTButtonClick = async () => {
    setPPTLoading(true);
    await sendMessage(
      `I will give you an array of json objects with 
    some ideas each idea has likes and highlighted 
    segments prioritize the highlighted (A highlighted 
      segment means one user only liked that part of 
      the idea, a highlight is linked to a like) 
      and liked parts and give me a 5 slide 
      prsentation showcasing your new idea, 
      develop a new idea which incorporates the most
      liked and highlighted parts and disregard 
      ideas with low or no likes, dont show me parts
      of the ideas just give your new idea. Use this 
      idea to make a 5 slide prsentation ,give me the 
      text on each slide organize it well list down pros 
      and cons have bullet points and atleast 50 words 
      on each slide ad slide 1, slide 2... before each 
      slide and add a \n (new line character) before 
      each slide. Do not include ideas with 0 likes` +
        JSON.stringify(ideasArray) +
        `just give me the summary and no other text and 
      dont show likes and anything as such`,
      false
    );
    setShowCompileBox(true); // Show the compile box when the button is clicked
    setHeading("Presentation"); // Change the heading to "Presentation"
    setPPTLoading(false);
  };

  const handleCompileBoxClose = () => {
    setShowCompileBox(false); // Close the compile box
    setHeading("Summary"); // Reset the heading to "Summary"
  };

  return (
    <Box
      sx={{
        width: "100vh-10px",
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
        <ButtonGroup variant="outlined" aria-label="Loading button group">
          <LoadingButton
            loading={false}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            sx={{ backgroundColor: "#05284C" }}
          >
            Save
          </LoadingButton>
          <LoadingButton
            loading={compileLoading}
            variant="contained"
            onClick={handleCompileButtonClick}
            sx={{ backgroundColor: "#05284C" }}
          >
            Compile
          </LoadingButton>
          <LoadingButton
            loading={pptLoading}
            variant="contained"
            onClick={handleToPPTButtonClick}
            sx={{ backgroundColor: "#05284C" }}
          >
            To PPT
          </LoadingButton>
        </ButtonGroup>
      </Box>
      {showCompileBox && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            backgroundColor: "#f0f0f0",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ marginBottom: "20px", textAlign: "center" }}
          >
            {heading}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCompileBoxClose}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          {compileBoxContent[currentPage - 1]}

          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              sx={{ marginTop: "20px" }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default Header;
