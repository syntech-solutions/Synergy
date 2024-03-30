// import { env } from 'process';
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const { env } = require('process');

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => {
    console.log('User connected: ', socket.id);

    socket.on('join room', (room) => {
        console.log("User: ", socket.id, " Joined Room: ", room); 
        socket.join(room);
    });

    socket.on('board sent', (msg, room) => {
        // console.log(msg, room);
        try{
            socket.to(room).emit('board rec', msg);
        }
        catch(err){
            console.log(err);
        }
        
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(env.PORT, () => {console.log('listening on *:8080')});