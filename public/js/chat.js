const socket = io()

socket.on('message', (msg)=>{
    console.log(msg)
})

document.querySelector('#message-form').addEventListener('submit', (e)=>{
    e.preventDefault()

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error)=>{
        if(error){
            return console.log(error)
        }
        console.log('Delivered')
    })
})

document.querySelector('#send-location').addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is Not Supported By your browser')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('userLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (error)=>{
            if(error){
                return console.log(error)
            }
            console.log('Location was Sent')
        })
    })
})