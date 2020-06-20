const socket = io()
const incrementButton = document.querySelector('#increment-button')

incrementButton.addEventListener('click', ()=>{
    console.log('clicked')
    socket.emit('increment')
})

socket.on('countUpdated', (count)=>{
    console.log('Count Had Been Updated', count);
    
})