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

io.on('connection', ()=>{
    console.log('New Web Socket Connection');
    
})

server.listen(PORT, ()=>{
    console.log('Hi, Running on Port : ' + PORT);
})