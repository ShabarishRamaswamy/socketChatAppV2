const socket = io()

//Elements 
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.getElementById('send-location')

socket.on('message', (msg)=>{
    console.log(msg)
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
        $sendLocationButton.setAttribute('disabled', 'disabled')
        socket.emit('userLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (error)=>{
            $sendLocationButton.removeAttribute('disabled')
            if(error){
                return console.log(error)
            }
            console.log('Location was Sent')
        })
    })
})