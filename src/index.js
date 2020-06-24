const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')

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

    socket.on('sendMessage', (msg, callback)=>{
        const filter = new Filter()
        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed')
        }
        io.emit('message', msg);
        callback()
    })

    socket.on('disconnect', ()=>{
        io.emit('message', 'A User has left')
    })

    socket.on('userLocation', (position, callback)=>{
        if(!position){
            return callback('Location Was not Sent')
        }
        socket.broadcast.emit('message', `https://www.google.com/maps/q?${position.latitude},${position.longitude}`)
        callback()
    })
})

server.listen(PORT, ()=>{
    console.log('Hi, Running on Port : ' + PORT);
})