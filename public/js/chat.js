const socket = io()

// Elements 
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.getElementById('send-location')
const $messages = document.querySelector('#messages')
const $locationMessages = document.querySelector('#locationMessage')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-template').innerHTML
const  sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (msg)=>{
    console.log(msg)    
    const html = Mustache.render(messageTemplate, {
        username: msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format('ddd h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData', ({ room, users }) => {
    console.log(room)
    console.log(users)
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector("#sidebar").innerHTML = html
})

socket.on('locationMessage', (url)=>{
    console.log(url)
    const urlMsg = Mustache.render(locationMessageTemplate, {
        username: url.username,
        locationMessage: url.url, 
        createdAt: moment(url.createdAt).format('ddd h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', urlMsg)
})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    //Disable the submit button
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        // Enable
        if(error){
            alert(error)
        }
        console.log('Delivered')
    })
})

document.querySelector('#send-location').addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is Not Supported By your browser')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        $sendLocationButton.setAttribute('disabled', 'disabled')
        socket.emit('userLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }, (error)=>{
            $sendLocationButton.removeAttribute('disabled')
            if(error){
                return console.log(error)
            }
            console.log('Location was Sent')
        })
    })
})

socket.emit('join', { username, room }, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})