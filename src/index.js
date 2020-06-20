const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

var app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count=0

io.on('connection', (socket)=>{
    console.log('New Web Socket Connection');

    socket.emit('countUpdated', count)

    socket.on('increment', ()=>{
        count++
        //socket.emit('countUpdated', count)
        io.emit('countUpdated', count)
    })
})

server.listen(PORT, ()=>{
    console.log('Hi, Running on Port : ' + PORT);
})