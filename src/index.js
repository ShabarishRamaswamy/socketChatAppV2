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

    socket.on('sendMessage', (msg)=>{
        io.emit('message', msg);
    })
})

server.listen(PORT, ()=>{
    console.log('Hi, Running on Port : ' + PORT);
})