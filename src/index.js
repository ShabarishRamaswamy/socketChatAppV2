const express = require('express')
const http = require('http')
const path = require('path')

var app = express()
const server = http.createServer(app)

const PORT = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

server.listen(PORT, ()=>{
    console.log('Hi, Running on Port : ' + PORT);
})