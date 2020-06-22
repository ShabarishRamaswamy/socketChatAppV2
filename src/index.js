const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

var app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 4000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket)=>{
    console.log('New Web Socket Connection');

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new User Has Joined!')

    socket.on('sendMessage', (msg)=>{
        io.emit('message', msg);
    })

    socket.on('disconnect', ()=>{
        io.emit('message', 'A User has left')
    })

    socket.on('userLocation', (position)=>{
        socket.broadcast.emit('message', `User is in ${position.latitude} and ${position.longitude}`)
    })
})

server.listen(PORT, ()=>{
    console.log('Hi, Running on Port : ' + PORT);
})