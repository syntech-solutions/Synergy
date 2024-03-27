import React, { useRef, useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  ListItem,
  List,
  ListItemAvatar,
  ListItemText,
  InputBase,
  Menu,
  MenuItem,
  Tooltip,
  Popper,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  TextField,
} from "@mui/material";
import Send from "@mui/icons-material/Send";
import Games from "@mui/icons-material/Games";
import CloseIcon from "@mui/icons-material/Close";
import People from "@mui/icons-material/People";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOff from "@mui/icons-material/VideocamOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import CallEndIcon from "@mui/icons-material/CallEnd";
import StopScreenShare from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// import Notification from "../Notification";
import VirtualWorkspaceWork from "./VirtualWorkspaceWork";
import Poll from "@mui/icons-material/Poll";
import { useImmer } from "use-immer";

// Imports for funcationality
import {
  onSnapshot,
  collection,
  doc,
  query,
  where,
  updateDoc,
  addDoc,
  serverTimestamp,
  DocumentReference,
  DocumentData,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import io from "socket.io-client";
import { Peer } from "peerjs";
import Video from "./Video";
import { set } from "firebase/database";
import Toolbar2 from "./Toolbar";
import NewIdeaBoard from "../tools/brainBoard/NewIdeaBoard";
import IdeaBoard from "../tools/brainBoard/IdeaBoard";
import TldrawApp from "../tools/whiteboard/TldrawApp";
import DocxEditor from "../tools/document/DocxEditor";
import { useNavigate } from "react-router-dom";

const CallButton = ({ label, Icon }) => {
  const [isActive, setIsActive] = useState(false);

  const handleButtonClick = () => {
    setIsActive(!isActive);
  };

  return (
    <Button
      variant="contained"
      startIcon={<Icon />}
      onClick={handleButtonClick}
      sx={{ bgcolor: "#0c2c4b" }}
    >
      {label}
    </Button>
  );
};

// check if video on stream is enabled
const isVideoEnabled = (stream) => {
  if (!stream) return false;
  return stream.getVideoTracks().some((track) => track.enabled);
};

const Member = ({ name, videoRef, scsState, mute2 }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #ccc",
        margin: "0px",
        padding: "0px",
        flexGrow: 1,
        backgroundColor: "grey.100",
        maxHeight: "750px",
        minWidth: {
          xs: "150px",
          sm: "190px",
          md: "290px",
          lg: "400px",
          xl: "400px",
        },
        objectFit: "cover",
        overflow: "hidden",

        // minWidth: window.innerWidth / 3 - 10 + "px",
      }} //xs sm md lg xl
    >
      {isVideoEnabled(videoRef) && !scsState ? (
        <Video mute={mute2} stream={videoRef} />
      ) : (
        <>
          <Avatar sx={{ bgcolor: "orange" }}>{name.charAt(0)}</Avatar>
          <Typography sx={{ position: "absolute", mt: "63px" }}>
            {name}
          </Typography>
        </>
      )}
    </Box>
  );
};
interface CallProps {
  callID: string;
  userID: string;
}
const CallScreen = ({ callID, userID }: CallProps) => {
  const members = ["Ziyaan", "Shaun"]; // Add your members here
  const [micState, setMicState] = useState(true);
  const [vidState, setVidState] = useState(true);
  const [scsState, setscsState] = useState(false);
  const [vwpState, setvwpState] = useState(false);
  const [permState, setPermState] = useState({});
  const [isBoxVisible, setIsBoxVisible] = useState(false); // State for box visibility
  const [isChatVisible, setIsChatVisible] = useState(false); // State for chat visibility
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor element
  const [pollOpen, setPollOpen] = useState(false); // State for dialog box
  const [value, setValue] = useState("");
  const [pollText, setPollText] = useState(""); // State for poll text
  const [displayedPollText, setDisplayedPollText] = useState(""); // State for displayed poll text
  const [yesCount, setYesCount] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [pollStarted, setPollStarted] = useState(false); // State for poll started
  const [pollSubmitted, setPollSubmitted] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [chatText, setChatText] = useState(""); // State for chat text
  const [showTool, setShowTool] = useState(false); // State for showing tools
  const [toolType, setToolType] = useState(""); // State for tool type
  const [toolID, setToolID] = useState(""); // State for tool ID
  const [toolButtonClicked, setToolButtonClicked] = useState(false); // State for tool button clicked

  // for tools
  const changeToolType = (tool) => {
    setToolType(tool);
  };

  const changeToolID = (id) => {
    setToolID(id);
  };
  const showTools = () => {
    setShowTool(!showTool);
    socket?.emit("show-tool", callID);
  };
  const changeToolButtonClicked = () => {
    setToolButtonClicked(!toolButtonClicked);
  };

  // for virtual workspace
  const [canvas, setCanvas] = useImmer(null);
  const sendPlayer = (newCanvas) => {
    socket?.emit("virtual-workspace", callID, newCanvas);
  };
  const getPosition = () => {
    let position = null;
    socket?.on("virtual-workspace", (canvasData) => {
      // console.log("canvas data received", canvasData.position);
      position = canvasData.position;
    });
    return position;
  };

  const [selectedMember, setSelectedMember] = useState(null);
  const anchorRef = useRef(null);

  // States for call functionality

  const [socket, setSocket] = useState(
    io.connect("https://tool-test-dev-rntb.1.us-1.fl0.io")
  );
  // const [socket, setSocket] = useState(io.connect("localhost:4004"));
  const [inviteID, setInviteID] = useState("");
  const [callData, setCallData] = useState({} as any);
  const [streamList, setStreamList] = useState<MediaStream[]>([]);
  const [peer, setPeer] = useState<Peer>(
    new Peer("", {
      host: "peer-server.cybertech13.eu.org",
      secure: true,
      port: 443,
    })
  );
  // const [peer, setPeer] = useState<Peer>(
  //   new Peer();
  const [sharedScreen, setSharedScreen] = useState<MediaStream | null>(null);
  // const [screenPeer, setScreenPeer] = useState<Peer>(
  //   new Peer("", {
  //     host: "peer-server.cybertech13.eu.org",
  //     secure: true,
  //     port: 443,
  //   })
  // );
  const [callSate, setCallState] = useState(null);
  const [gettingCall, setGettingCall] = useState(false);
  const [notification, setNotification] = useState(null);

  const sendToolMessage = (toolType, toolID) => {
    socket?.emit("openTool", callID, toolType, toolID);
    console.log("tool message sent", toolType, toolID);
    console.log("socket", socket);
  };

  const handleNewPoll = () => {
    socket?.emit("new-poll", callID, pollText);
    setPollStarted(true);
    console.log("new poll", pollText);
  };
  const handleScreenShare = () => {
    setscsState(!scsState);
    if (!scsState) {
      shareScreen();
    }
  };

  const handleOpenVWS = () => {
    setvwpState(!vwpState);
    socket?.emit("vws-opened", callID);
  };

  socket?.on("vws-opened", () => {
    setvwpState(!vwpState);
  });

  socket?.on("new-poll", (pollText) => {
    setPollOpen(true);
    setDisplayedPollText(pollText);
    console.log("displayed poll text ", displayedPollText);
    setYesCount(0);
    setNoCount(0);
    setPollSubmitted(false);
    setPollStarted(true);
  });

  socket?.on("poll-result", (yes, no) => {
    setYesCount(yes);
    setNoCount(no);
  });

  socket?.on("send-message", (message) => {
    setChatList([...chatList, message]);
  });

  socket?.on("openTool", (toolType, toolID) => {
    setToolID(toolID);
    setToolType(toolType);
  });
  socket?.on("show-tool", () => {
    setShowTool(!showTool);
  });
  useEffect(() => {
    if (!showTool) {
      setToolID("");
      setToolType("");
    }
  }, [showTool]);
  // deciding which tool to show
  const selectNewTool = () => {
    if (toolType === "brainBoard") {
      console.log("new tool brain board");
      return (
        <NewIdeaBoard
          sendSocketMessage={sendToolMessage}
          changeToolType={changeToolType}
          changeToolID={changeToolID}
          showTool={showTool}
          changePressedToolButton={changeToolButtonClicked}
          callID={callID}
          userID={userID}
        />
      );
    } else if (toolType === "whiteboard") {
      return <TldrawApp roomID={callID} />;
    } else if (toolType === "doc") {
      return <DocxEditor />;
    }
  };

  // deciding which tool to show
  const selectTool = () => {
    if (toolType === "brainBoard") {
      return <IdeaBoard boardName="" boardId={toolID} />;
    } else if (toolType === "whiteboard") {
      return <TldrawApp roomID={callID} />;
    } else if (toolType === "doc") {
      return <DocxEditor />;
    } else {
      return <LinearProgress />;
    }
  };

  const handleBoxToggle = () => {
    setIsBoxVisible(!isBoxVisible);
  };

  const handleChatToggle = () => {
    setIsChatVisible(!isChatVisible);
  };

  const handleMenuOpen = (event, member) => {
    setAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const togglePermState = (member) => {
    setPermState({
      ...permState,
      [member]: !permState[member],
    });
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMember(null);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = () => {
    let newYesCount = yesCount;
    let newNoCount = noCount;
    if (value === "Yes") {
      newYesCount = yesCount + 1;
      setYesCount(yesCount + 1);
    } else if (value === "No") {
      newNoCount = noCount + 1;
      setNoCount(noCount + 1);
    }
    setPollSubmitted(true);
    socket?.emit("poll-result", callID, newYesCount, newNoCount);
    // setOpen(false);
  };

  const ScreenShareBox = () => {
    return (
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "70%" },
            backgroundColor: "rgba(0,0,0,1)",
          }}
        >
          {sharedScreen != null ? (
            <Video mute={true} stream={sharedScreen} />
          ) : (
            <></>
          )}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", sm: "flex" },
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "stretch",
            width: "30%",
          }}
        >
          {members.map((member, index) => (
            <Member
              name={member}
              key={member}
              videoRef={streamList[index]}
              scsState={scsState}
              mute2={false}
            />
          ))}
        </Box>
      </Box>
    );
  };

  const total = yesCount + noCount;
  const yesPercentage = total ? (yesCount / total) * 100 : 0;
  const noPercentage = total ? (noCount / total) * 100 : 0;

  // Functions for call functionality
  // initialize the local stream when the component mounts
  useEffect(() => {
    if (streamList.length == 0) {
      const initializeLocalStream = async () => {
        const constraints = {
          video: true,
          audio: true,
        };
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          setStreamList([stream]);

          // setLocalStream(stream);
        } catch (error) {
          console.error("Error accessing media devices", error);
        }
      };

      initializeLocalStream();
    }
  }, []);

  // changing mic and video state
  useEffect(() => {
    if (streamList[0]) {
      streamList[0].getAudioTracks().forEach((track) => {
        track.enabled = micState;
      });
      streamList[0].getVideoTracks().forEach((track) => {
        track.enabled = vidState;
      });
    }
  }, [micState, vidState]);

  const shareScreen = async () => {
    socket?.emit("share-screen", callID);
    if (!scsState) {
      replaceStream();
    }
  };

  // create the socket connection and join the room when the component mounts
  useEffect(() => {
    // create the socket connection only once
    console.log("socket created", userID);
    console.log(socket, userID);
    console.log("socket connected", userID);

    peer.on("open", (id) => {
      console.log("peer open", userID);
      socket.emit("join-room", callID, id);
    });
    console.log("joined room", userID);

    return () => {
      socket.disconnect();
    };
  }, []);

  // when a user disconnects, remove all inactive streams from the stream list
  socket?.on("user-disconnected", async () => {
    setTimeout(() => {
      setStreamList((prevStreamList) => {
        return prevStreamList.filter((stream) => stream.active === true);
      });
    }, 1000);
  });

  // answer the call when someone calls
  useEffect(() => {
    const answerCall = async () => {
      peer?.on("call", async (call) => {
        console.log("call received", userID);
        const constraints = {
          video: vidState,
          audio: micState,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setStreamList((prevStreamList) => {
          prevStreamList[0] = stream;
          return [...prevStreamList];
        });
        call.answer(stream);
        call.on("stream", (remoteStream) => {
          console.log("remote stream", remoteStream, userID);
          setStreamList((prevStreamList) => {
            // Check if the stream already exists in the list
            if (!prevStreamList.includes(remoteStream)) {
              // If not, add it to the list
              return [...prevStreamList, remoteStream];
            } else {
              // If it does, return the previous list
              return prevStreamList;
            }
          });
        });
      });
      const callDocRef = doc(db, "calls", callID);
      await updateDoc(callDocRef, {
        participants: arrayUnion(userID),
      });
      onSnapshot(callDocRef, (snapshot) => {
        const data = snapshot.data();
        setCallData(data);
        console.log("call data", data);
      });
    };
    answerCall();
  }, [peer]);

  // call a user when they join the socket room
  useEffect(() => {
    const callUser = async () => {
      socket?.on("user-joined", async (userid) => {
        const constraints = {
          video: vidState,
          audio: micState,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setStreamList((prevStreamList) => {
          prevStreamList[0] = stream;
          return [...prevStreamList];
        });

        console.log(peer, userID);
        console.log("local Stream", stream);
        const call = peer.call(userid, stream);
        console.log("call", call);
        setCallState(call);
        call.on("stream", (remoteStream) => {
          console.log("remote stream", remoteStream, userID);
          setStreamList((prevStreamList) => {
            // Check if the stream already exists in the list
            if (!prevStreamList.includes(remoteStream)) {
              // If not, add it to the list
              return [...prevStreamList, remoteStream];
            } else {
              // If it does, return the previous list
              return prevStreamList;
            }
          });
        });
        call.on("close", () => {
          setStreamList((prevStreamList) => {
            return prevStreamList.filter((stream) => stream.active === true);
          });
        });

        console.log("user joined", userid, userID);
      });
    };
    callUser();
  }, [socket]);

  socket?.on("share-screen", (shareId) => {
    setSharedScreen(streamList[1]);
  });

  function replaceStream() {
    navigator.mediaDevices
      .getDisplayMedia({
        video: true,
      })
      .then((stream) => {
        callSate?.peerConnection.getSenders().forEach((sender) => {
          if (
            sender.track.kind === "audio" &&
            stream.getAudioTracks().length > 0
          ) {
            sender.replaceTrack(stream.getAudioTracks()[0]);
          }
          if (
            sender.track.kind === "video" &&
            stream.getVideoTracks().length > 0
          ) {
            sender.replaceTrack(stream.getVideoTracks()[0]);
          }
        });
        // setStreamList((prevStreamList) => {
        //   prevStreamList[0] = stream;
        //   return [...prevStreamList];
        // });
        setSharedScreen(stream);
      });
  }

  useEffect(() => {
    if (!callData.share) {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          callSate?.peerConnection.getSenders().forEach((sender) => {
            if (
              sender.track.kind === "audio" &&
              stream.getAudioTracks().length > 0
            ) {
              sender.replaceTrack(stream.getAudioTracks()[0]);
            }
            if (
              sender.track.kind === "video" &&
              stream.getVideoTracks().length > 0
            ) {
              sender.replaceTrack(stream.getVideoTracks()[0]);
            }
          });
          setStreamList((prevStreamList) => {
            prevStreamList[0] = stream;
            return [...prevStreamList];
          });
          setSharedScreen(null);
        });
    }
  }, [callData]);

  useEffect(() => {
    setscsState(callData.share);
  }, [callData]);

  // update share state in db
  useEffect(() => {
    const callDocRef = doc(db, "calls", callID);
    try {
      updateDoc(callDocRef, {
        share: scsState,
      });
    } catch (err) {
      console.error("Error updating share status", err);
    }
  }, [scsState]);

  useEffect(() => {
    const listenToNotifications = async () => {
      console.log("listening to notifications", userID);
      const notifDocRef = collection(db, "user", userID, "notifications");
      onSnapshot(
        query(
          notifDocRef,
          where("read", "==", false),
          where("type", "==", "call")
        ),
        (snapshot: { docChanges: () => any[] }) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              console.log("New call notification: ", change.doc.data(), userID);
              setGettingCall(true);
              setNotification(change.doc);
              setNotificationRead(change.doc.ref);
              setTimeout(() => {
                setGettingCall(false);
              }, 20000);
            }
            if (change.type === "modified") {
              console.log("Modified notification: ", change.doc.data(), userID);
            }
            if (change.type === "removed") {
              console.log("Removed notification: ", change.doc.data(), userID);
            }
          });
        }
      );
    };
    listenToNotifications();

    const unsubscribe = onSnapshot(doc(db, "calls", callID), (snapshot) => {
      const data = snapshot.data();
      setCallData(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const inviteUser = async (toUserID: string) => {
    const notifDoc = {
      id: callID,
      senderID: userID,
      read: false,
      type: "call",
      name: "Calling",
      createdAt: serverTimestamp(),
      description: "You have been invited to a call",
    };
    const notifDocRef = collection(db, "user", toUserID, "notifications");
    await addDoc(notifDocRef, notifDoc);
  };

  const acceptCall = async () => {
    console.log("accepting call", userID);

    setGettingCall(false);
    setNotification(null);
  };

  useEffect(() => {
    console.log("stream List", streamList);
  }, [streamList]);

  const setNotificationRead = async (
    docRef: DocumentReference<DocumentData>
  ) => {
    try {
      await updateDoc(docRef, { read: true });
      console.log("Notification read");
    } catch (error) {
      console.error("Error setting notification read", error);
    }
  };

  // updating share status on db so everyone in call opens the share window
  // useEffect(() => {
  //   const callDocRef = doc(db, "calls", callID);
  //   try {
  //     updateDoc(callDocRef, {
  //       share: scsState,
  //       shareId: ,
  //     });
  //   } catch (err) {
  //     console.error("Error updating share status", err);
  //   }
  // }, [scsState]);

  useEffect(() => {
    setscsState(callData.share);
  }, [callData]);

  // useEffects for virtual workspace
  // useEffect(() => {
  //   console.log("canvas data sent", canvas);
  // }, [canvas]);

  // return starts here

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        // bgcolor: "grey.200",
      }}
    >
      <AppBar position="static" sx={{ bgcolor: "#0c2c4b" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ width: "13%" }}>
            00:00
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h5"
              component="div"
              textAlign="center"
              fontWeight="bold"
            >
              Study Meeting
            </Typography>
          </Box>
          <Tooltip title="People In This Call">
            <Button
              color="inherit"
              aria-label="People"
              onClick={handleBoxToggle}
            >
              <People />
            </Button>
          </Tooltip>
          <Tooltip title="Chat">
            <Button
              color="inherit"
              aria-label="Chat"
              onClick={handleChatToggle}
            >
              <ChatIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Virtual Workspace">
            <Button
              color="inherit"
              aria-label="Virtual Workspace"
              onClick={() => handleOpenVWS()}
            >
              <Games />
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* <Notification caller="Rachael" /> */}

      {/* Box */}
      {isBoxVisible && (
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: { xs: "100%", sm: "100%", md: "27%" },
            bgcolor: "white",
            overflowY: "auto",
            zIndex: 100,
            borderLeft: "1px solid #ccc",
            minWidth: "300px",
          }}
        >
          <Button
            sx={{ position: "absolute", right: 0 }}
            onClick={handleBoxToggle}
          >
            <CloseIcon sx={{ color: "#0c2c4b", margin: "15px" }} />
          </Button>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ margin: "15px", fontWeight: "bold" }}
          >
            Members
          </Typography>

          {/* Search bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "2px",
              marginBottom: "10px",
              marginLeft: "15px",
              marginRight: "15px",
            }}
          >
            <InputBase
              placeholder="Invite User"
              inputProps={{ "aria-label": "search" }}
              sx={{ ml: 1, flex: 1 }}
            />
            <Send sx={{ marginRight: "5px" }} /> {/* INVITE USER HERE PLSSSS */}
          </Box>
          <List>
            {members.map((member) => (
              <ListItem
                key={member}
                sx={{
                  border: "1px solid #e5e5e5",
                  "&:hover": { backgroundColor: "grey.100" },
                }}
              >
                {" "}
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#0c2c4b" }}>
                    {member.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={member} />
                {/* ... other ListItem children ... */}
                <Button
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={(event) => handleMenuOpen(event, member)}
                >
                  <MoreVertIcon
                    sx={{
                      color: "#0c2c4b",
                    }}
                  />
                </Button>
              </ListItem>
            ))}
          </List>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Mute</MenuItem>
            <MenuItem onClick={handleMenuClose}>Make Moderator</MenuItem>
            <MenuItem onClick={() => togglePermState(selectedMember)}>
              {permState[selectedMember]
                ? "Revoke Tool Access"
                : "Grant Tool Access"}
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>Remove</MenuItem>
          </Menu>
        </Box>
      )}

      {/* Chat*/}
      {isChatVisible && (
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: { xs: "100%", sm: "100%", md: "27%" },
            bgcolor: "white",
            overflowY: "auto",
            zIndex: 100,
            borderLeft: "1px solid #ccc",
            minWidth: "300px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Button
            sx={{ position: "absolute", right: 0 }}
            onClick={handleChatToggle}
          >
            <CloseIcon sx={{ color: "#0c2c4b", margin: "15px" }} />
          </Button>
          {/* Chats */}
          <Box sx={{ mt: "50px" }}>
            {chatList.map((chat) => (
              <Box
                sx={{
                  margin: "20px",
                  padding: "10px",
                  backgroundColor: "lightGrey",
                  borderRadius: "5px",
                }}
              >
                <Typography>{chat}</Typography>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "2px",
              marginBottom: "20px",
              marginLeft: "15px",
              marginRight: "15px",
              marginTop: "auto",
            }}
          >
            <InputBase
              placeholder="Send a message..."
              inputProps={{ "aria-label": "search" }}
              sx={{ ml: 1, flex: 1 }}
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
            />
            <Send
              sx={{ marginRight: "5px", "&:hover": { cursor: "pointer" } }}
              onClick={() => {
                socket?.emit("send-message", callID, chatText);
                setChatText("");
              }}
            />{" "}
            {/* INVITE USER HERE PLSSSS */}
          </Box>
        </Box>
      )}

      {/*MAIN BOX FOR MEMBERS HERE!!*/}
      {!scsState ? (
        !vwpState ? (
          !showTool ? (
            <>
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "stretch",
                }}
              >
                <Member
                  name={members[0]}
                  key={members[0]}
                  videoRef={streamList[0]}
                  scsState={scsState}
                  mute2={true}
                />
                {streamList.slice(1).map((stream, index) => (
                  <Member
                    name={members[index]}
                    key={members[index]}
                    videoRef={stream}
                    scsState={scsState}
                    mute2={false}
                  />
                ))}
              </Box>
            </>
          ) : (
            <Box
              sx={{
                width: "100%",
                backgroundColor: "rgba(256,256,256,1)",
                minHeight: "750px",
                zIndex: 0,
              }}
            >
              {/*fgd  */}
              {toolButtonClicked ? selectNewTool() : selectTool()}
            </Box>
          )
        ) : (
          <>
            {" "}
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "rgba(256,256,256,1)",
                }}
              >
                {sharedScreen != null ? (
                  <Video mute={true} stream={sharedScreen} />
                ) : (
                  <></>
                )}
                {
                  <VirtualWorkspaceWork
                    exCanvasRef={canvas}
                    sendPlayer={sendPlayer}
                    getBoard={getPosition}
                    socket={socket}
                  />
                }
              </Box>
            </Box>
          </>
        )
      ) : (
        <ScreenShareBox></ScreenShareBox>
      )}

      {/* <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        {members.map((member, index) => (
          <Member name={member} key={member} videoRef={streamList[index]} />
        ))}
      </Box> */}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          p: 2,
          mb: 2,
          marginTop: "25px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0c2c4b",
            }}
            onClick={() => setMicState(!micState)}
          >
            {micState ? <MicIcon /> : <MicOffIcon />}
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#0c2c4b" }}
            onClick={() => setVidState(!vidState)}
          >
            {vidState ? <VideocamIcon /> : <VideocamOff />}
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#0c2c4b" }}
            onClick={() => handleScreenShare()}
          >
            {scsState ? <StopScreenShare /> : <ScreenShareIcon />}
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0c2c4b",
            }}
            onClick={
              pollOpen ? () => setPollOpen(false) : () => setPollOpen(true)
            }
            ref={anchorRef}
          >
            <Poll />
          </Button>
          <Popper
            open={pollOpen}
            anchorEl={anchorRef.current}
            placement="top"
            modifiers={[
              {
                name: "offset",
                options: {
                  offset: [0, 10], // move the Popper up by 10px
                },
              },
            ]}
            sx={{
              zIndex: 1000,
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "20px",
            }}
          >
            {!pollSubmitted ? (
              <>
                <TextField
                  variant="outlined"
                  label="New Poll"
                  value={pollText}
                  onChange={(e) => setPollText(e.target.value)}
                  sx={{ marginLeft: "15px" }}
                />
                <Send
                  onClick={() => {
                    handleNewPoll();
                    setDisplayedPollText(pollText);
                    setPollText("");
                    setYesCount(0);
                    setNoCount(0);
                  }}
                  sx={{
                    mt: 2,
                    marginLeft: "15px",
                    "&:hover": { cursor: "pointer" },
                  }}
                />
                {pollStarted ? (
                  <>
                    <Typography sx={{ p: 2 }}>{displayedPollText}</Typography>
                    <RadioGroup
                      aria-label="poll"
                      sx={{ marginLeft: "15px" }}
                      value={value}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#0c2c4b",
                        marginTop: "19px",
                        marginLeft: "33px",
                        marginBottom: "10px",
                      }}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </>
                ) : null}
              </>
            ) : (
              <div>
                <TextField
                  variant="outlined"
                  label="New Poll"
                  value={pollText}
                  onChange={(e) => setPollText(e.target.value)}
                  sx={{ marginLeft: "15px" }}
                />
                <Send
                  onClick={() => {
                    handleNewPoll();
                    setDisplayedPollText(pollText);
                    setPollText("");
                    setPollSubmitted(false);
                    setYesCount(0);
                    setNoCount(0);
                  }}
                  sx={{
                    mt: 2,
                    marginLeft: "15px",
                    "&:hover": { cursor: "pointer" },
                  }}
                />
                <Typography sx={{ p: 2 }}>{displayedPollText}</Typography>

                <Typography
                  variant="body1"
                  style={{ marginTop: "5px" }}
                >{`Yes: ${yesPercentage.toFixed(2)}%`}</Typography>
                <LinearProgress
                  variant="determinate"
                  value={yesPercentage}
                  sx={{ marginBottom: "15px" }}
                />
                <Typography variant="body1">{`No: ${noPercentage.toFixed(
                  2
                )}%`}</Typography>
                <LinearProgress
                  variant="determinate"
                  value={noPercentage}
                  sx={{ marginBottom: "10px" }}
                />

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#0c2c4b",
                    marginTop: "19px",
                    marginLeft: "41px",
                    marginBottom: "10px",
                  }}
                  onClick={() => setPollOpen(false)}
                >
                  Close
                </Button>
              </div>
            )}
          </Popper>
        </Box>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "red",
            alignSelf: { xs: "center", sm: "auto" },
          }}
          onClick={() => navigate(-1)}
        >
          <CallEndIcon />
        </Button>
      </Box>
      <Box sx={{ position: "absolute" }}>
        <Toolbar2
          changeToolType={changeToolType}
          buttonPressed={changeToolButtonClicked}
          showTool={showTools}
          sendSocketMessage={sendToolMessage}
        />
      </Box>
    </Box>
  );
};

export default CallScreen;
