/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    createMuiTheme,
    createTheme,
  } from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';

import { auth, provider } from "../../config/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut, getAuth, onAuthStateChanged
} from "firebase/auth";
import { db } from "../../config/firebase"; // Import the necessary package
//import { FirebaseError } from "@firebase/util";
import { addDoc, doc, getCountFromServer, getDoc, onSnapshot, setDoc } from "firebase/firestore"; 
import { collection, query, where, getDocs } from "firebase/firestore";


import { useNavigate } from "react-router-dom";
import { Navigate, useLocation } from 'react-router-dom';

import { Component } from 'react';

import * as ChatFunctions from "./ChatFunctions";
import {ChatClass} from "./ChatFunctions";
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import ChatMain from "../Chat/ChatMain";

// Firestore data converter
const nameConverter = {
    toFirestore: (chats) => {
        return {
            From: chats.From,
            Profile: chats.Profile,
            Description: chats.Description,
            Time: chats.Time
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new ChatClass(data.From, data.Profile, data.Description, data.Time);
    }
};

async function getNameFromDb(userId) {

    try {
            //const ref = doc(db, "userDetails/" + userId + "/peopleUserKnows/peopleName").withConverter(nameConverter);
            //const userDoc = await getDoc(ref);
            

            const chats: Array<ChatClass> = [];

            const q = query(collection(db, "userDetails/" + userId + "/chats").withConverter(nameConverter));

            const querySnapshot = await getDocs(q);
            //let i = 0;
            //console.log("before: " + globalChatPerson.length);
            let n = globalChatPerson.length;
            for (let i = 0; i < n; i++) {
                globalChatPerson.splice(i, n);
            }
             

            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
                if (doc.exists()) {
                    //console.log(doc.id, " => ", doc.data().getFrom().toString());
                    //chats.push(doc.data());
                    ChatFunctions.globalChatPerson.push(doc.data());
                    //chats.push(doc.data());
                } else {
                    // docSnap.data() will be undefined in this case
                    console.log("No such document!");
                }
            });

            console.log("func: " + ChatFunctions.globalChatPerson[0].getFrom());
            //console.log("no func: " + chats[0].getFrom());

            return globalChatPerson;
        } catch (error) {
        // if ((error as FirebaseError).code === "") {

        // }
        console.log(error);
        }
}

/*function getChats() {

        const chats1: Array<unknown> = [];

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
            const result1 = await getNameFromDb(auth.currentUser?.uid);
            chats1.push(result1);
        }
        });

        console.log("chat1: " + chats1[0]);

        return chats1;

}*/


function ChatPeopleName(props) {
    return <Typography variant="h6" sx={{
        fontSize: '90%',
        }} align="left">
        {props.name}
    </Typography>;
  }

function ChatPeopleDescription(props) {
    return <Typography sx={{fontSize: '92.5%', fontFamily: 'Calibri', textTransform: 'none'}} align="left">
                {props.name}
            </Typography>;
  }

function ChatPeopleTime(props) {
    return <Typography sx={{
                fontSize: '80%', fontFamily: 'Calibri', textTransform: 'none', marginLeft: '3%'
                }} align="left">
                {props.name}
            </Typography>;
  }

function ChatPeopleProfilePicture(props) {
    return <Box  sx={{
        height: 50,
        width: 50,
        marginLeft: '3%',
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#EE964B',
        borderRadius: '100%',
        }}>
            <Typography variant="h6" color="primary" sx={{

                color: '#FFFFFF',

            }}>
            {props.name}
            </Typography>
        </Box>;
  }
  export let globalChatPerson;
  export let globalProfile;
  export let globalName;

  function renderChats(chat) {

    //globalChatPerson = chatID;

    //console.log(chat);

    const entries = Object.entries(chat);
    const uid = auth.currentUser?.uid;
    let profile = "";
    let name = "";
    //console.log(entries[0][1]);
    const entries2 = Object.entries(entries[0][1]);
    //console.log(entries2);
      if(entries2.length == 2) {
        for(let i = 0; i < entries2.length; i++) {
            if(entries2[i][0] != uid) {
                profile = entries2[i][1][1];
                name = entries2[i][1][0];
                //console.log(profile);
            }
        }
      } else {
        profile = "";
        name = "group chat";
        //console.log(profile);
      }

      const updateChat = () => {
        globalChatPerson = chat.key;
        globalProfile = profile;
        globalName = name;
        //console.log(globalChatPerson);
        }

    //query here stuff for message

    return <Box sx={{
        height: "13%",
        width: "100%",
        }}>
        <Button sx={{
            width: '100%',
            height: '100%',
            display: 'inline-flex',
            justifyContent: 'space-between'
        }} id="person" onClick={() => updateChat()}>

            <ChatPeopleProfilePicture name={profile} />
                

            <Box sx={{
                    marginRight: '20%'}}>

                <ChatPeopleName name={name} />

                {/*<ChatPeopleDescription name={chats[0].getDescription()} />*/}
            </Box>

            <Box>
                {/*<ChatPeopleTime name={chats[0].getTime()} />*/}

                <IconButton size="medium" sx={{marginLeft: '3%'}}>
                    <PushPinOutlinedIcon fontSize="medium"/>
                </IconButton>

            </Box>
        </Button>
    </Box>;

  }

const ChatPeople = () => {
        //getChats();

        const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

        const handleClicky = (event: React.MouseEvent<HTMLElement>) => {
            setAnchor(anchor ? null : event.currentTarget);
        };

        const open = Boolean(anchor);
        const id = open ? 'simple-popper' : undefined;
        
        const [userSignOutChat, setUserSignOutChat] = useState(false);

        const placeHolderChat = new ChatClass('h','h','h',0);

        const [chats, setChats] = useState<any>([]);
        const [chatID, setChatID] = useState<any>(['']);
        const [currentChatID, setCurrentChatID] = useState<any>("");
        const [chatsNotUndifined, setChatsNotUndifined] = useState<any>(false);
        //const methodMap = { propetryName: setPropertyName}
        
        const navigate = useNavigate();

        /*const handleClickForChatSelect = (id) => {
            setCurrentChatID(id);
        };*/
        const createChatsInDB = async () => {

            
            const newChat = collection(db, "chats");
            const newChatSnap = await getCountFromServer(newChat);

            const getTotalChatsOfUserSender = newChatSnap.data().count + 1; //for getting messages for user to assign apropraite name
            const newMassageNameToStringSender = "C" + getTotalChatsOfUserSender.toString();

            const usersRef = collection(db, "userData");        
            const uid = auth.currentUser?.uid;
            const docIdToExclude = uid; // replace with your document ID to exclude
            const querySnapshot = await getDocs(usersRef); // replace with your collection name
            let userIDArr = [];

            querySnapshot.forEach((doc) => {
                if (doc.id !== docIdToExclude) {
                console.log(doc.id, " => ", doc.data());
                userIDArr.push(doc.id);
                }
            });

            //create chats by using the logged in user

            /*await setDoc(doc(newChat, newMassageNameToStringSender), {
                Participants: obj
            
            });
            const newCollectionRef = collection(db, "Chats", newMassageNameToStringSender, "Messages");
            const firstmessage = "M0";

            await setDoc(doc(newCollectionRef, firstmessage), {
                //data: 'Hello there World',
            })*/

        };

        /*React.useEffect(() => {


            createChatsInDB();
            


        }, []);*/

        const handleClicky2 = async () => {
            const newChat = collection(db, "chats");
            const newChatSnap = await getCountFromServer(newChat);

            const id1 = "8wsUXPNslmSc83awMD0Qqtu2m3G2";
            const id2 = "XrnfrGReqUam98KLSY0i0CyY5bR2";

            const name1 = "Adam Drai";
            const name2 = "Zak Drai";

            const profilePic1 = "AD";
            const profilePic2 = "ZD";

            const p = new Map([[ id1, [name1, profilePic1]],[ id2, [name2, profilePic2]]]);

            const obj = Object.fromEntries(p);
    


            const getTotalChatsOfUserSender = newChatSnap.data().count + 1; //for getting messages for user to assign apropraite name
    
            const newMassageNameToStringSender = "C" + getTotalChatsOfUserSender.toString();
            console.log(newMassageNameToStringSender);

            await setDoc(doc(newChat, newMassageNameToStringSender), {
                Participants: obj
            
            });
            const newCollectionRef = collection(db, "chats", newMassageNameToStringSender, "Messages");
            const firstmessage = "M0";

            await setDoc(doc(newCollectionRef, firstmessage), {
                //data: 'Hello there World',
            })
        };

        const chatColl = collection(db, "chats");
        const qchatColl = query(chatColl);

        const getChats2 = async () => {

            let tempChats = [];
            //let tempChatID = [];
            const uid = auth.currentUser.uid;

            onSnapshot(qchatColl, querySnapshot => {

                querySnapshot.docChanges().forEach((change) => {
    
    
                    if (change.type === "added") {
                        if(change.doc.id !== "chatID") { //check also if logged in user is in participants
    
                            //const entries = Object.entries(change.doc.data().Participants);
                            //console.log("yea: " + change.doc.data().Participants.uid);
                            let mapField = change.doc.data().Participants;
                            if(mapField[uid]) {
                                console.log("ID exists in the map with value: ", mapField[uid]);
                                tempChats.push({...change.doc.data(), key: change.doc.id});
                              } else {
                                console.log("ID does not exist in the map");
                              }
                            //tempChatID.push(change.doc.id);

    
                        }
                    }
    
    
                });

                setChats(tempChats);
                //setChatID(tempChatID);
                //globalChatPerson = tempChatID;
                if(tempChats.length != 0) {
                    setChatsNotUndifined(true);
                }
            });

        }
        React.useEffect(() => {


            getChats2();
            //console.log(chats);
            //console.log(chatID);
            //if()


        }, [chats]);

        React.useEffect(() => {
            const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUserSignOutChat(false);
                console.log("User is signed in");
                createChatsInDB();
                //const result = await getNameFromDb(auth.currentUser?.uid);
                //setChats(result);
                //console.log(chats[0]);
                /*const uid = user.uid;
                const result = await getNameFromDb(uid);
                setChats(result);*/
            } else {
                setUserSignOutChat(true);
                console.log("User is not signed in");
                navigate("/");
            }
            });

            return () => unsubscribe();
        }, []);

        /*const auth = getAuth();
            onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                //const uid = user.uid;
                //await getNameFromDb(uid);
                //setChats(ChatFunctions.globalChatPerson);
                //console.log(chats[0].getFrom());
                // ...
            } else {
                // User is signed out
                // ...
            }
            });*/
  
    return (
        <>
        {/*<Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            padding: '1%',
            backgroundColor: 'red'
        }}>

        </Box>*/}

        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            padding: '1%',
            boxShadow: 3
        }}>

            <Box sx={{
                height: "10%",
                width: "100%",
                p: '0.5%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: '0',
                
                overflow: "visible",
                }}>
           {/*fontSize="medium" sx={{color: '#FFFFFF'}} sx={{marginRight: '50%'}}*/}
                <Button variant="contained" startIcon={<AddIcon fontSize="large"/>} sx={{
                    color: '#FFFFFF', 
                    backgroundColor: '#EE964B',
                    '&:hover': {
                        backgroundColor: '#FFFFFF',
                        color: '#EE964B',
                    },
                    height: 40,
                    width: 150
                    }} onClick={handleClicky2}>
                    <Typography sx={{fontSize: 16}}>
                        New Chat
                    </Typography>
                    
                </Button>
                {/*<BasePopup id={id} open={open} anchor={anchor}>
                <Box sx={{
                        height: "40vh",
                        width: "25vw",
                        backgroundColor: "#FFFFFF",
                        border: 1,
                        }}>
                        </Box>
                </BasePopup>*/}

            </Box>

            <Box sx={{
                height: "7.5%",
                width: "100%",
                p: '0.5%',
                display: 'flex',
                justifyContent: 'center',
                paddingBottom: '0%',
                }}>
            
                <FormControl sx={{
                        marginBottom: '0%',
                        width: '95%',
                        height: '84%',
                        borderRadius: '5.25%'
                        }}>
                    <TextField
                    InputLabelProps={{shrink: false}} placeholder="Search for chats" size="small"
                    sx={{width: '100%'}}
                    InputProps={{
                        startAdornment: 
                            <IconButton size="small" sx={{marginRight: '5%'}}>
                                <SearchOutlinedIcon fontSize="medium"/>
                            </IconButton>
                        }}>
                    </TextField>
                </FormControl>

            </Box>

            <Box sx={{
                height: "6%",
                width: "100%",
                display: 'flex',
                justifyContent: 'center',
                }}>

                    <Typography variant="h5" align="center" color="#EE964B" sx={{fontSize: 28}}>
                        CHATS
                    </Typography>
            
            </Box>
{/*put extra box here*/}
            <Box sx={{
                height: "76.5%",
                width: "100%",
                overflow: 'auto'
                }}> 


    {chatsNotUndifined ? chats.map((chat) => (renderChats(chat))): ""}
                
                
            </Box>
        </Box>
        </>
    );
  };

  

  export default ChatPeople;

  
