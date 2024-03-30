import ReactQuill from "react-quill";
import { Timestamp } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useContext, useState, useCallback } from "react";
// import { AuthContext } from "../context/AuthContext";
import "react-quill/dist/quill.snow.css";
import "./Quill.css";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import io, { Socket } from "socket.io-client";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { throttle, debounce } from "lodash";
import { Box } from "@mui/material";

const filterIncomingChanges = (incomingChanges) => {
  // No conflict resolution needed for HTML content
  return incomingChanges;
};

// Function to apply changes (replace entire content with new HTML)
const applyChanges = (currentContent, changes) => {
  // Simply replace the entire content with the new HTML
  return changes;
};

const MyComponent = () => {
  const [content, setContent] = useState("");

  const handleChange = useCallback(
    throttle((value) => {
      setContent(value);
      // Place your socket emit code or any other update logic here
    }, 1000),
    []
  ); // Adjust the 1000 ms delay to suit your needs

  return (
    <input
      type="text"
      value={content}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
};

interface DocxEditorProps {}
const DocxEditor = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  const [showRoomWindow, setShowRoomWindow] = useState(false);
  const { currentUser } = ""; // PLACE CURRENT USER HERE
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  // const navigate = useNavigate();
  // let changes: any = {};
  // const [socket, setSocket] = useState();
  // const [room, setRoom] = useState("a");

  const applyChanges = (currentContent, changes) => {
    // Simply replace the entire content with the new HTML
    return changes;
  };

  const handleRoomWindow = () => {
    setShowRoomWindow(!showRoomWindow);
  };

  let changes = {};
  const [socket, setSocket] = useState();
  const [room, setRoom] = useState("");

  useEffect(() => {
    // Create a Socket
    const socket = io.connect("https://synergyserver-dev-eddj.1.us-1.fl0.io");

    setSocket(socket);

    // Clean up the connection when the component unmounts
    return () => {
      console.log("DISCONNECTED");
      socket.disconnect();
    };
  }, []);

  const [isExternalUpdate, setIsExternalUpdate] = useState(false);

  useEffect(() => {
    changes = content;
    console.log(changes);

    sendBoard();
  }, [content]);

  const sendBoard = () => {
    if (socket) {
      socket?.emit("board sent", changes, room);
      console.log("Sent the changes to room --> " + room);
    }
  };

  // useEffect() when new message arrives
  useEffect(() => {
    socket?.on("board rec", (incomingChanges) => {
      setIsExternalUpdate(true); // Mark updates as external to block re-emission
      console.log("Incoming Changes: " + incomingChanges);
      const filteredChanges = filterIncomingChanges(incomingChanges);
      const newContent = applyChanges(content, filteredChanges);

      if (newContent !== content) {
        setContent(newContent);
      }
      setIsExternalUpdate(false); // Reset after applying changes
    });
  }, [socket, isExternalUpdate]);

  const setRoomfunc = (event, room) => {
    event.preventDefault(setRoom(room));
  };

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button
      ["link", "image", "video"], // link and image, video
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "script",
    "align",
    "direction",
    "link",
    "image",
    "video",
    "color",
    "background",
  ];

  const handleChange = useCallback(
    debounce((value) => {
      if (!isExternalUpdate) {
        // Make sure to define isExternalUpdate state correctly
        setContent(value);
        // Emit changes to the server or update Firestore
      }
    }, 500),
    [isExternalUpdate]
  );

  useEffect(() => {
    // create the socket connection only once
    // const socket = io.connect("http://localhost:4001");
    const socket = io.connect("https://synergyserver-dev-eddj.1.us-1.fl0.io"); //this website
    setSocket(socket);
    socket.on("connect", () => {
      socket?.emit("join room", room);
      console.log("Connected to server");
    });
    // clean up the connection when the component unmounts
    return () => socket.disconnect();
  }, []);

  // useEffect(() => {
  //   const getContent = async () => {
  //     try {
  //       const id = searchParams.get("id").toString();

  //       console.log(id);

  //       const fileRef = doc(collection(db, "Files"), id);
  //       const fileSnapshot = await getDoc(fileRef);
  //       const file = fileSnapshot.data();

  //       setContent(file.content);
  //       setTitle(file.title);
  //     } catch (Exception) {
  //       console.log("NO ID");
  //     }
  //   };

  //   getContent();
  //   }, [searchParams])

  const handleName = (value) => {
    //   setTitle(value.toString());
    // }
    // const handleSave = async () => {
    //   if (!content) {
    //     return;
    //   }
    //   let id = null;
    //   try {
    //     id = searchParams.get("id").toString();
    //   } catch (Exception) {
    //     console.log("NO ID Passed");
    //   }
    //   if (id === null) {
    //     const fileID = uuidv4();
    //     console.log("SAVED: " + title)
    //   //   const userRef = doc(collection(db, "document"), currentUser.email);
    //   //   const userSnapshot = await getDoc(userRef);
    //   //   const user = userSnapshot.data();
    //   //   const userChange = await updateDoc(userRef, {files: [...user.files, fileID]})
    //   //   const response = await setDoc(doc(db, "Files", fileID), {content, title, fileID});
    //   // } else {
    //   //   console.log(id);
    //   //   const response = await updateDoc(doc(db, "Files", id), {content, title, id});
    //   const documentRef = collection(db, "document");
    //   const documentData = {docName:title, docData:content};
    //   const document = await addDoc(documentRef, documentData);
    //   }
    // navigate("/Dashboard");
  };

  const handlePrint = () => {
    console.log("Print document:", content);
  };

  const handleInsertImage = () => {
    const imageUrl = prompt("Enter image URL:");
    if (imageUrl) {
      const cursorPosition = content.length;
      setContent(`${content}\n![Image]( ${imageUrl} )\n`);
      setTimeout(() => {
        const quill = document.querySelector(".ql-editor");
        if (quill) quill.setSelection(cursorPosition, 0);
      }, 0);
    }
  };

  const handleInsertLink = () => {
    const linkUrl = prompt("Enter link URL:");
    if (linkUrl) {
      const selectedText = window.getSelection().toString();
      const linkText = selectedText || prompt("Enter link text:") || "Link";
      const cursorPosition = content.length;
      setContent(`${content}\n[${linkText}](${linkUrl})\n`);
      setTimeout(() => {
        const quill = document.querySelector(".ql-editor");
        if (quill) quill.setSelection(cursorPosition, 0);
      }, 0);
    }
  };

  const handleInsertCodeBlock = () => {
    const cursorPosition = content.length;
    setContent(`${content}\n\`\`\`\n// Your code here\n\`\`\`\n`);
    setTimeout(() => {
      const quill = document.querySelector(".ql-editor");
      if (quill) quill.setSelection(cursorPosition + 4, 0);
    }, 0);
  };

  return (
    <div>
      <div className="bg-secondary w-full text-white font-semibold flex">
        <Box
          sx={{
            width: "100vh-10px",
            backgroundColor: "#EE964B",
            p: "10px",
          }}
        >
          <TextField
            id="title"
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="small" // Makes the TextField smaller
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "8px", // Adds rounded corners to the TextField
              marginRight: 1, // Adds space to the right of the TextField
              marginTop: 2,
              width: "auto", // Adjust the width as needed
              flexGrow: 1, // Allows it to grow with the space available
              marginLeft: 3,
              marginBottom: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#0c2c4b", // replace #colorCode with your desired color.
                },
                "&:hover fieldset": {
                  borderColor: "#0c2c4b", // replace #hoverColorCode with your desired color.
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0c2c4b", // replace #focusedColorCode with your desired color.
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={() => {}}
            sx={{
              margin: 1, // Adjust spacing as needed
              marginLeft: 1,
              marginTop: 2,
              backgroundColor: "#0c2c4b", // Customize colors as needed
              "&:hover": {
                backgroundColor: "#ffa500", // Customize hover colors as needed
              },
            }}
          >
            Save
          </Button>

          <Button
            variant="contained"
            onClick={handleRoomWindow}
            sx={{
              marginTop: 1,
              backgroundColor: "#0c2c4b", // Customize colors as needed
              "&:hover": {
                backgroundColor: "#ffa500", // Customize hover colors as needed
              },
            }}
          >
            Share
          </Button>
        </Box>

        {showRoomWindow && (
          <div className="flex justify-center items-center bg-none p-4">
            <TextField
              label="Enter the Room Code"
              variant="outlined"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
              size="small" // Makes the TextField smaller
              sx={{
                marginRight: 1, // Adds space to the right of the TextField
                width: "auto", // Adjust the width as needed
                flexGrow: 1, // Allows it to grow with the space available
                marginLeft: 3,
                marginBottom: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#0c2c4b", // replace #colorCode with your desired color.
                  },
                  "&:hover fieldset": {
                    borderColor: "#0c2c4b", // replace #hoverColorCode with your desired color.
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0c2c4b", // replace #focusedColorCode with your desired color.
                  },
                },
              }}
            />

            <Button
              variant="contained"
              onClick={() => socket?.emit("join room", room)}
              sx={{
                marginLeft: 1, // Adds space to the left of the Button, adjust value as needed
                whiteSpace: "nowrap", // Prevents the text from wrapping into the next line
                backgroundColor: "#0c2c4b",
                "&:hover": {
                  backgroundColor: "#ffa500", // Customize hover colors as needed
                },
              }}
            >
              Join Room
            </Button>
          </div>
        )}
      </div>

      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className="bg-primary text-white w-full h-[800px]"
      />
    </div>
  );
};

export default DocxEditor;

//when recieve update, dont send update
