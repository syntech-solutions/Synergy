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




import {Timestamp} from "firebase/firestore";

export class ChatClass {
    From: string = '';
    Profile: string = '';
    Description: string = '';
    Time: unknown;

    constructor (From: string, Profile: string, Description: string, Time: unknown) {
        this.From = From;
        this.Profile = Profile;
        this.Description = Description;
        this.Time = Time;
    }
    getFrom() {
        return this.From;
    }
    getProfile() {
        return this.Profile;
    }
    getDescription() {

        return this.Description;
    }
    getTime() {

        return this.Time;
    }
}

export const placeHolderChat = new ChatClass('h','h','h',0);

export const nameConverter = {
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


//export let globalChatPerson;

/*export class PClass {
    ID: string = '';
    Name: Timestamp;
    sentBool: boolean;

    constructor (Content: string, Time: Timestamp, sentBool: boolean) {
        this.Content = Content;
        this.Time = Time;
        this.sentBool = sentBool;
    }
    getContent() {
        return this.Content;
    }
    getTime() {
        return this.Time;
    }
    getBool() {
        return this.sentBool;
    }
}*/

export class MessageClass {
    Content: string = '';
    Time: Timestamp;
    sentBool: boolean;

    constructor (Content: string, Time: Timestamp, sentBool: boolean) {
        this.Content = Content;
        this.Time = Time;
        this.sentBool = sentBool;
    }
    getContent() {
        return this.Content;
    }
    getTime() {
        return this.Time;
    }
    getBool() {
        return this.sentBool;
    }
}

export const nameConverterSent = {
    toFirestore: (message) => {
        return {
            content: message.content,
            time: message.time,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new MessageClass(data.content, data.time, true);
    }
};

export const nameConverterRecieved = {
    toFirestore: (message) => {
        return {
            content: message.content,
            time: message.time,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new MessageClass(data.content, data.time, false);
    }
};

/*export function getContentData() {
    return new Promise((resolve) => {
      // fetch async stuff here
      resolve(MessageClass);
    })
}*/

export class MessageClass2 {
    Text: string = '';
    timeSent: Timestamp;
    Sender: string = '';

    constructor (Text: string, timeSent: Timestamp, Sender: string) {
        this.Text = Text;
        this.timeSent = timeSent;
        this.Sender = Sender;
    }
    getContent() {
        return this.Text;
    }
    getTime() {
        return this.timeSent;
    }
    getSender() {
        return this.Sender;
    }
}

export const nameConverterSentMessage = {
    toFirestore: (message) => {
        return {
            text: message.text,
            timeSent: message.timeSent,
            sender: message.sender,

            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new MessageClass2(data.text, data.timeSent, data.sender);
    }
};