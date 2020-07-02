const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage }= require('./utils/messages')

var app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 4000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket)=>{
    console.log('New Web Socket Connection');


    socket.on('join', ({ username, room })=>{
        socket.join(room)

        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} Has Joined!`))
        //socket.emit, io.emit, socket.broadcast.emit
        //Rooms: //io.to().emit, socket.broadcast.to().emit
    })

    socket.on('sendMessage', (msg, callback)=>{
        const filter = new Filter()
        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed')
        }
        io.to('a').emit('message', generateMessage(msg));
        callback()
    })

    socket.on('disconnect', ()=>{
        io.emit('message', generateMessage('A User has left'))
    })

    socket.on('userLocation', (position, callback)=>{
        if(!position){
            return callback('Location Was not Sent')
        }
        socket.broadcast.emit('locationMessage', generateLocationMessage(`https://www.google.com/maps/q?${position.latitude},${position.longitude}`))
        callback()
    })
})

server.listen(PORT, ()=>{
    console.log('Hi, Running on Port : ' + PORT);
})