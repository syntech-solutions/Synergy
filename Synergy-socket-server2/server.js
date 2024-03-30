const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');


app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

let roomsWithUsers = {};

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        console.log('user connected: ', userId);
        socket.join(roomId);

        try{
            socket.to(roomId).emit('user-joined', userId);
            console.log('user joined: ', userId);
        }
        catch(err){
            console.log(err);
        }
        socket.on("share-screen", (roomId) => {
            console.log('user sharing screen: ');
            socket.to(roomId).emit("share-screen");
        });
        socket.on("virtual-workspace", (roomId, userId) => {
            console.log('user sharing virtual workspace: ', userId);
            socket.to(roomId).emit("virtual-workspace", userId);
        });
        socket.on("vws-opened", (roomId) => {
            console.log('user opened virtual workspace: ', roomId);
            socket.to(roomId).emit("vws-opened");
        });
        socket.on("new-poll", (roomId, poll) => {
            console.log('new poll created: ', poll);
            socket.to(roomId).emit("new-poll", poll);
        });
        socket.on("poll-result", (roomId, yes, no) => {
            console.log('poll result: ', yes, no);
            socket.to(roomId).emit("poll-result", yes, no);
        });
        socket.on("send-message", (roomId, message) => {
            console.log('new message: ', message);
            socket.to(roomId).emit("send-message", message);
        });
        socket.on("show-tool", (roomId) => {
            console.log('Tool shown: ', roomId);
            socket.to(roomId).emit("show-tool");
        });
        socket.on("openTool", (roomId, toolType, ToolId) => {
            console.log('Tool opened: ', toolType, ToolId);
            socket.to(roomId).emit("openTool", toolType, ToolId);
        });
        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId);
            console.log('user disconnected: ', userId);
        });

    });

    // socket.on('broadcast', (msg, room) => {
    //     // console.log(msg, room);
    //     try{
    //         socket.to(room).broadcast('user-joined', userId);
    //     }
    //     catch(err){
    //         console.log(err);
    //     }
        
    // });

});


server.listen(4004, () => {
  console.log('Server listening on port 4004');
});
