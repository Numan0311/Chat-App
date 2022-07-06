const express = require('express');
const app = express();
const server = app.listen(5000);
const socket = require('socket.io');
const path=require('path')
const formatMessage=require('./utils/messages')
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/users');
require('dotenv').config();


app.use(express.static(path.join(__dirname,'public')));

const io=socket(server);

const botName='Chat Bot'
// Run when client Connects
io.on('connection',socket=>{
    console.log('New WS Connection..');
    socket.on('joinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room)

        socket.join(user.room);

        socket.emit('message',formatMessage(botName,'Welcome to Chat App'));

        // Broadcast when a user connects for multiple
        socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`))

        // Send Users & Room Info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    })


    // Runs when clients disconnect
    socket.on('disconnect',()=>{
        const user=userLeave(socket.id);

        if(user){
        io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`))
        }
    });

    // Lister for Client Side Chat Message

    socket.on('chatMessage',(msg)=>{
        const user=getCurrentUser(socket.id);
        console.log(user)
       io.to(user.room).emit('message',formatMessage(user.username,msg));
    })
})


