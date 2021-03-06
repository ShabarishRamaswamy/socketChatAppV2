const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage }= require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

var app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 4000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket)=>{
    console.log('New Web Socket Connection');


    socket.on('join', ({ username, room }, callback)=>{
        const {error, user} = addUser({ id: socket.id, username, room })
        
        if(error){
            return callback(error) 
        }

        socket.join(user.room)
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} Has Joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (msg, callback)=>{
        const filter = new Filter()
        const user = getUser(socket.id)
        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed')
        }
        io.to(user.room).emit('message', generateMessage(user.username, msg));
        callback()
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message', generateMessage(user.username, `${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })

    socket.on('userLocation', (position, callback)=>{
        const user = getUser(socket.id)
        if(!position){
            return callback('Location Was not Sent')
        }
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://www.google.com/maps/q?${position.latitude},${position.longitude}`))
        callback()
    })
})

server.listen(PORT, ()=>{
    console.log('Hi, Running on Port : ' + PORT);
})