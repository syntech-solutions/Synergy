/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { VisibilityOff, Visibility, ForkLeft } from "@mui/icons-material";
import Container from "@mui/material/Container";
import SendIcon from "@mui/icons-material/Send";
import TagFacesOutlinedIcon from "@mui/icons-material/TagFacesOutlined";
import AttachFileTwoToneIcon from "@mui/icons-material/AttachFileTwoTone";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import Paper from "@mui/material/Paper";

import { auth, db } from "../../config/firebase"; // Import the necessary package
//import { FirebaseError } from "@firebase/util";
import {
  Firestore,
  doc,
  getCountFromServer,
  getDoc,
  setDoc,
  Timestamp,
  orderBy,
  onSnapshot,
  QuerySnapshot,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";

import * as ChatPeople from "./ChatPeople";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  ChatClass,
  nameConverter,
  MessageClass,
  nameConverterRecieved,
  nameConverterSent,
  nameConverterSentMessage,
  MessageClass2,
} from "./ChatFunctions";
import { update } from "firebase/database";
import { storage } from "../../config/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { uploadBytes } from "firebase/storage";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { globalChatPerson, globalName, globalProfile } from "./ChatPeople";

function ChatProfilePicture(props) {
  return (
    <Typography
      variant="h6"
      color="primary"
      sx={{
        color: "#FFFFFF",
      }}
    >
      {props.name}
    </Typography>
  );
}

function ChatName(props) {
  return (
    <Typography
      variant="h6"
      color="primary"
      alignItems="center"
      display="inline"
      sx={{ marginLeft: 1 }}
    >
      {props.name} {/*text for name*/}
    </Typography>
  );
}

function RenderMessages(props, participants) {
  const uid = auth.currentUser?.uid;
  const p = Object.keys(participants).length;

  const entries = Object.entries(participants);

  let name = "";

  //console.log("p: " + p);
  //const specific = participants.find((participants) => participants.name === uid);
  //console.log(specific);
  //console.log(entries);
  for (let i = 0; i < entries.length; i++) {
    if (entries[i][0] == props.sender) {
      name = entries[i][1][1];
      //console.log(name);
    }
  }
  //console.log(Object.keys(participants).length);

  if (p > 2) {
    if (props.isFile == true) {
      if (props.sender != uid) {
        return (
          <Box
            sx={{
              //Box for a reply message box to put it at flex end
              height: "max-content",
              width: "100%",
              marginBottom: 2, //use this for message sender
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Box
              sx={{
                //Box for a reply message box to put it at flex end
                height: "100%",
                width: "45%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Box
                sx={{
                  height: "max-content",
                  width: "max-content",
                  paddingLeft: 0.8,
                  paddingRight: 0.8,
                  paddingTop: 0.5,
                  paddingBottom: 0.5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#EE964B",
                  borderRadius: "100%",
                  marginTop: 0.55,
                  marginRight: 2,
                }}
              >
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{
                    color: "#FFFFFF",
                  }}
                >
                  {name}
                </Typography>
              </Box>
              <Box
                sx={{
                  //Box for a message
                  height: "max-content",
                  width: "max-content",
                  p: 1,
                  backgroundColor: "#D9D9D9",
                  //marginBottom: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton
                  size="small"
                  sx={{ marginRight: "5%" }}
                  href={props.fileURL}
                >
                  <InsertDriveFileIcon fontSize="medium" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        );
      } else {
        return (
          <Box
            sx={{
              //Box for a reply message box to put it at flex end
              height: "max-content",
              width: "100%",
              marginBottom: 2, //use this for message sender
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Box
              sx={{
                //Box for a reply message box to put it at flex end
                height: "100%",
                width: "45%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {/*Box for a message*/}
              <Box
                sx={{
                  height: "max-content",
                  width: "max-content",
                  backgroundColor: "#05284C",
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton
                  size="small"
                  sx={{ marginRight: "5%" }}
                  href={props.fileURL}
                >
                  <InsertDriveFileIcon
                    fontSize="medium"
                    sx={{ color: "#FFFFFF" }}
                  />
                </IconButton>
              </Box>
            </Box>
          </Box>
        );
      }
    } else {
      if (props.sender != uid) {
        return (
          <Box
            sx={{
              //Box for a reply message box to put it at flex end
              height: "max-content",
              width: "100%",
              marginBottom: 2, //use this for message sender
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Box
              sx={{
                //Box for a reply message box to put it at flex end
                height: "100%",
                width: "45%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Box
                sx={{
                  height: "max-content",
                  width: "max-content",
                  paddingLeft: 0.8,
                  paddingRight: 0.8,
                  paddingTop: 0.5,
                  paddingBottom: 0.5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#EE964B",
                  borderRadius: "100%",
                  marginRight: 2,
                }}
              >
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{
                    color: "#FFFFFF",
                  }}
                >
                  {name}
                </Typography>
              </Box>
              <Box
                sx={{
                  //Box for a message
                  height: "max-content",
                  width: "max-content",
                  p: 1,
                  backgroundColor: "#D9D9D9",
                  //marginBottom: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  className="text"
                  align="left"
                  color="primary"
                  sx={{ fontSize: 16 }}
                >
                  {" "}
                  {/*Message*/}
                  {props.text}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      } else {
        return (
          <Box
            sx={{
              //Box for a reply message box to put it at flex end
              height: "max-content",
              width: "100%",
              marginBottom: 2, //use this for message sender
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Box
              sx={{
                //Box for a reply message box to put it at flex end
                height: "100%",
                width: "45%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {/*Box for a message*/}
              <Box
                sx={{
                  height: "max-content",
                  width: "max-content",
                  backgroundColor: "#05284C",
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography align="left" color="#FFFFFF" sx={{ fontSize: 16 }}>
                  {" "}
                  {/*Message*/}
                  {props.text}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      }
    }
  } else {
    if (props.isFile == true) {
      if (props.sender != uid) {
        return (
          <Box
            sx={{
              //Box for a reply message box to put it at flex end
              height: "max-content",
              width: "100%",
              marginBottom: 2, //use this for message sender
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Box
              sx={{
                //Box for a reply message box to put it at flex end
                height: "100%",
                width: "45%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Box
                sx={{
                  //Box for a message
                  height: "max-content",
                  width: "max-content",
                  p: 1,
                  backgroundColor: "#D9D9D9",
                  //marginBottom: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton
                  size="small"
                  sx={{ marginRight: "5%" }}
                  href={props.fileURL}
                >
                  <InsertDriveFileIcon fontSize="medium" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        );
      } else {
        return (
          <Box
            sx={{
              //Box for a reply message box to put it at flex end
              height: "max-content",
              width: "100%",
              marginBottom: 2, //use this for message sender
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Box
              sx={{
                //Box for a reply message box to put it at flex end
                height: "100%",
                width: "45%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {/*Box for a message*/}
              <Box
                sx={{
                  height: "max-content",
                  width: "max-content",
                  backgroundColor: "#05284C",
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton
                  size="small"
                  sx={{ marginRight: "5%" }}
                  href={props.fileURL}
                >
                  <InsertDriveFileIcon
                    fontSize="medium"
                    sx={{ color: "#FFFFFF" }}
                  />
                </IconButton>
              </Box>
            </Box>
          </Box>
        );
      }
    } else {
      if (props.sender != uid) {
        return (
          <Box
            sx={{
              //Box for a reply message box to put it at flex end
              height: "max-content",
              width: "100%",
              marginBottom: 2, //use this for message sender
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Box
              sx={{
                //Box for a reply message box to put it at flex end
                height: "100%",
                width: "45%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Box
                sx={{
                  //Box for a message
                  height: "max-content",
                  width: "max-content",
                  p: 1,
                  backgroundColor: "#D9D9D9",
                  //marginBottom: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  className="text"
                  align="left"
                  color="primary"
                  sx={{ fontSize: 16 }}
                >
                  {" "}
                  {/*Message*/}
                  {props.text}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      } else {
        return (
          <Box
            sx={{
              //Box for a reply message box to put it at flex end
              height: "max-content",
              width: "100%",
              marginBottom: 2, //use this for message sender
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Box
              sx={{
                //Box for a reply message box to put it at flex end
                height: "100%",
                width: "45%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {/*Box for a message*/}
              <Box
                sx={{
                  height: "max-content",
                  width: "max-content",
                  backgroundColor: "#05284C",
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography align="left" color="#FFFFFF" sx={{ fontSize: 16 }}>
                  {" "}
                  {/*Message*/}
                  {props.text}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      }
    }
  }
}

async function messageSender(input, chatSelected) {
  let uid;
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    console.log(user);

    uid = user.uid;

    if (input != undefined) {
      console.log(input + " " + chatSelected + "hh");

      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      /* TO DO add date incase message is sent yesterday AND ADD SECONDS*/

      console.log(hours.toString() + minutes.toString());

      const time = hours.toString() + minutes.toString();

      const timeInteger = Timestamp.now();

      const ref = doc(
        db,
        "userDetails/" + uid + "/chats",
        chatSelected
      ).withConverter(nameConverter);
      const docSnap = await getDoc(ref);

      const messageSent = collection(
        db,
        "userDetails/" + uid + "/chats/" + chatSelected + "/messagesSent"
      );
      const messageSentSnapshot = await getCountFromServer(messageSent);

      const getTotalChatsOfUserSender = messageSentSnapshot.data().count; //for getting messages for user to assign apropraite name

      const newMassageNameToStringSender =
        "M" + getTotalChatsOfUserSender.toString(); //making the message name to string
      console.log(newMassageNameToStringSender);

      await setDoc(doc(messageSent, newMassageNameToStringSender), {
        content: input,
        time: timeInteger,
      });

      const toToFrom = docSnap.data().getFrom().toString(); //'however chat.getfrom is becomes our To field + also we query the chat.from to set doc in froms messges recieved';

      const q = query(
        collection(db, "userDetails"),
        where("name", "==", toToFrom)
      ); //to get into the right chat we use our uid to get our name and find correct chat with query that matches our name in the from field.
      let docId = "";
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        docId = doc.id;
      });

      console.log(docId);

      const messageRecieved = collection(
        db,
        "userDetails/" + docId + "/chats/" + chatSelected + "/messagesRecieved"
      );
      const messageRecievedSnapshot = await getCountFromServer(messageRecieved);

      const getTotalChatsOfUserReciever = messageRecievedSnapshot.data().count;
      const newMassageNameToStringReciever =
        "M" + getTotalChatsOfUserReciever.toString();
      console.log(newMassageNameToStringReciever);

      await setDoc(doc(messageRecieved, newMassageNameToStringReciever), {
        content: input,
        time: timeInteger,
      });
    } else {
      console.log("pls write some text");
    }
    // ...
  } else {
    // User is signed out
    // ...
  }
}

async function messageSender2(input, chatSelected) {
  let uid;
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    console.log(user);

    uid = user.uid;

    if (input != undefined) {
      //console.log(input + " " + chatSelected + "hh");

      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      /* TO DO add date incase message is sent yesterday AND ADD SECONDS*/

      console.log(hours.toString() + minutes.toString());

      const time = hours.toString() + minutes.toString();

      const timeInteger = Timestamp.now();

      const messageSent = collection(db, "chats/" + chatSelected + "/Messages");
      const messageSentSnapshot = await getCountFromServer(messageSent);

      const getTotalChatsOfUserSender = messageSentSnapshot.data().count; //for getting messages for user to assign apropraite name

      const newMassageNameToStringSender =
        "M" + getTotalChatsOfUserSender.toString(); //making the message name to string
      console.log(newMassageNameToStringSender);

      await setDoc(doc(messageSent, newMassageNameToStringSender), {
        text: input,
        timeSent: timeInteger,
        sender: uid,
        isFile: false,
      });
    } else {
      console.log("pls write some text");
    }
    // ...
  } else {
    // User is signed out
    // ...
  }
}
// the uid array will tally all users in chat then if it is more then one we will just add pf pic for all messages recieved ie not messges equal to our uid

let storageRef: any;
let fileURL: string;

const Chat = () => {
  const [text, setText] = useState("");

  const time = new Timestamp(2, 5);
  const placeHolderMessage = new MessageClass("h", time, true);
  //const [setChatSelected, getChatSelected] = useState("C1");

  const [m1, setm1] = useState<any>([]);
  const [messageNotUndifined, setmessageNotUndifined] = useState(false);
  const [getFileUpload, setFileUpload] =
    useState<MutableRefObject<null> | null>();
  const inputFile = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [getParticipants, setParticipants] = useState<any>();

  const [chatSelected, setChatSelected] = useState<any>("C3");
  const [profile, setProfile] = useState<any>("");
  const [name, setName] = useState<any>("");

  React.useEffect(() => {
    if (globalChatPerson != undefined) {
      setChatSelected(globalChatPerson);
      console.log("main: " + globalChatPerson);
    } else {
      setChatSelected("C3");
    }
  }, [globalChatPerson]);

  React.useEffect(() => {
    if (globalProfile != undefined) {
      setProfile(globalProfile);
      //console.log("main: " + globalProfile);
    } else {
      setProfile("");
    }
  }, [globalProfile]);

  React.useEffect(() => {
    if (globalName != undefined) {
      setName(globalName);
      //console.log("main: " + globalChatPerson);
    } else {
      setName("");
    }
  }, [globalName]);

  const messageSent = collection(db, "chats/" + chatSelected + "/Messages");
  const qSender = query(messageSent, orderBy("timeSent"));
  const chat = doc(db, "chats/" + chatSelected);

  const getTest2 = async () => {
    let messages1 = [];

    /*const qs = await getDocs(messageSent);

        if (qs.empty) {
            console.log('no documents found');
        } else {
            // do something with the data
            console.log("yea");
            qs.forEach((doc) => {
                console.log(doc.data());
            });
        }*/

    onSnapshot(qSender, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          if (change.doc.data().timeSent !== undefined) {
            //console.log("yea: " + change.doc.data().Text);

            messages1.push(change.doc.data());
          }
        }
      });

      /*let tempArr = [...messages1];

            if(tempArr.length > 0) {

                let n = tempArr.length;
                let min_indx = 0;
                let temp;

                for (let i = 0; i < n; i++) {
                    min_indx = i;
                    for (let j = i+1; j < n; j++) {

                        if(tempArr[j].getTime().valueOf() < tempArr[min_indx].getTime().valueOf()) {

                            min_indx = j;
                        }

                    }

                    temp = tempArr[min_indx]; 
                    tempArr[min_indx] = tempArr[i]; 
                    tempArr[i] = temp;
                    
                }

                //console.log(tempArr);
                setmessageNotUndifined(true);

            }*/
      setm1(messages1);
      //const docRef = doc(db, "cities", "SF");
      //console.log(m1);
      /*let senders = [];
            for (let i = 0; i < messages1.length; i++) {
                if(senders.includes(messages1[i].sender) == false) {
                    senders.push(messages1[i].sender);
                }
            }*/

      //console.log("total peeople: " + senders);
    });
    const docSnap = await getDoc(chat); //this is a problem
    if (docSnap.exists()) {
      //console.log(Object.keys(docSnap.data().Participants).length);
      setParticipants(docSnap.data().Participants);
      //const p = Object.keys(participants).length;
      /*const uid = auth.currentUser?.uid;
            const entries = Object.entries(getParticipants);

            let namey = "";
            for(let i = 0; i < entries.length; i++) {
                    if(entries[i][0] != uid) {
                        namey = entries[i][1][1];
                        if(name == "") {
                            setName(namey);
                            setProfile(namey[0]);
                        }
                        //console.log(namey);
                    }
            }
            const uid = auth.currentUser.uid;
            let mapField = docSnap.data().Participants;
            if(!mapField[uid]) {
                console.log("ID exists in the map with value: ", !mapField[uid]);
            } else {
                console.log("ID does not exist in the map");
            }*/
    }

    setmessageNotUndifined(true);
  };

  React.useEffect(() => {
    getTest2();
    //console.log(m1);
  }, [m1]);

  const uploadFileToStorageToStorage = async (file: any) => {
    storageRef = ref(storage, `chatDocs/${file.name + uuidv4()}`);
    setUploading(true);
    await uploadBytes(storageRef, file).then((snapshot) => {});
  };

  const getFileURL = async () => {
    console.log("getting url");
    const url = await getDownloadURL(storageRef);
    fileURL = url;
    console.log("got url");
    console.log(fileURL);
  };

  const uploadFileToFirestore = async (file: any) => {
    await getFileURL();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const fileDoc = {
      sender: auth.currentUser?.uid,
      timeSent: serverTimestamp(),
      isFile: true,
      fileType: file.type,
      fileName: file.name,
      folderContent: [],
      fileURL: fileURL,
    };
    const messageRef = collection(db, "chats", chatSelected, "Messages");
    console.log("adding document");
    await addDoc(messageRef, fileDoc);
    console.log("document added");
  };

  const handleFileUpload = async (event: any) => {
    if (event.target.files[0] != null) {
      console.log("upoloading file");
      await uploadFileToStorageToStorage(event.target.files[0]);
      console.log("file uploaded");
      try {
        console.log("upload to firestore");
        await uploadFileToFirestore(event.target.files[0]);
      } catch (error) {
        console.log(error);
      }
      setUploading(false);
      fileURL = "";
    }
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  return (
    <>
      {/*Big box for all component items*/}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          padding: "1%",
        }}
      >
        {/*box for header*/}
        <Box
          sx={{
            height: "12.3%",
            width: {
              xs: "100vw",
              sm: "100vw",
              md: "100vw",
              lg: "66.55vw",
              xl: "66.55vw",
            },
            p: "0.5%",
            paddingLeft: "2%",
            paddingRight: "0.5%",
            display: "inline-flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 3,
            borderColor: "rgba(0, 0, 0, 0.1)",
            m: -3,
            marginBottom: 2,
          }}
        >
          {/*Box inside header for name and profile picture*/}
          <Box
            sx={{
              height: "70%",
              width: "50%",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {/*Circle box for profile picture*/}
            <Box
              sx={{
                height: 45,
                width: 45,
                marginRight: "1%",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#EE964B",
                borderRadius: "100%",
              }}
            >
              <ChatProfilePicture name={profile} />
            </Box>

            <ChatName name={name} />
          </Box>

          {/*Other box inside header for call and options buttons*/}
          <Box
            sx={{
              height: "70%",
              width: "40%",
              display: "inline-flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <ButtonGroup
              sx={{
                height: "87%",
              }}
            >
              <IconButton size="medium" sx={{}}>
                <CallOutlinedIcon fontSize="medium" />
              </IconButton>

              <IconButton size="medium" sx={{}}>
                <MoreHorizOutlinedIcon fontSize="medium" />
              </IconButton>
            </ButtonGroup>
          </Box>
        </Box>

        {/*Box for chat messages*/}
        <Box
          sx={{
            height: "80%",
            width: "100%",
            p: "2%",
            paddingLeft: "5%",
            paddingRight: "5%",
            overflow: "auto",
          }}
        >
          {messageNotUndifined
            ? m1.map((message) => RenderMessages(message, getParticipants))
            : ""}

          {/*make function on its own*/}
        </Box>

        {/*Box for footer*/}
        <Box
          sx={{
            height: "10%",
            width: "100%",
            paddingLeft: 2.15,
            paddingRight: 3,
          }}
        >
          {/*Form control to put text input and send buttons inside*/}
          <FormControl
            sx={{
              m: 1, //CHANGE TO PERCENTAGE AND MAYBE PADDING NOT MARGIN NONONO KEEP MARGIN
              height: "90%",
              width: "98.75%",
            }}
          >
            {/*Text input*/}
            <TextField
              InputLabelProps={{ shrink: false }}
              onChange={(event) => {
                setText(event.target.value);
              }}
              InputProps={{
                //For buttons inside text field
                endAdornment: (
                  <ButtonGroup>
                    {" "}
                    {/*Button group for file and send at end of text field*/}
                    <input
                      style={{ display: "none" }}
                      // accept=".zip,.rar"
                      ref={inputFile}
                      onChange={(event) => handleFileUpload(event)}
                      type="file"
                    />
                    <IconButton
                      size="small"
                      sx={{ marginRight: "5%" }}
                      onClick={onButtonClick}
                    >
                      <AttachFileTwoToneIcon fontSize="medium" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ marginRight: "2.5%" }}
                      onClick={() => {
                        messageSender2(text, globalChatPerson);
                      }}
                    >
                      <SendIcon fontSize="medium" />
                    </IconButton>
                  </ButtonGroup>
                ),

                startAdornment: (
                  <IconButton
                    size="medium"
                    sx={{
                      //Button for emojis at start of text field
                      marginRight: "1%",
                    }}
                  >
                    <TagFacesOutlinedIcon fontSize="medium" sx={{}} />
                  </IconButton>
                ),
              }}
              placeholder="Say something..."
            ></TextField>
          </FormControl>
        </Box>
      </Box>
    </>
  );
};

//renderMessages("C1");

export default Chat;
