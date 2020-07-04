const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Cleam the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the  data 
    if(!username || !room){
        return {
            error: 'Username and Room are required'
        }
    }

    // Check for Existing User
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate Username
    if (existingUser){
        return {
            error: 'Username is In Use'
        }
    }

    // Store User
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) =>{
    const index = users.findIndex((user)=> user.id === id)  

    if(index != -1){
        return {
            username: index.name,
            room: index.room,
            id: index.id
        }
    }else {
        return undefined
    }
}

// removeUser()

const getUser = (id) => {
    const index = users.findIndex((user)=> user.id === id)

    if(index != -1){
        return users[index]
    } else {
        return undefined
    }
}

const getUsersInRoom = (roomName) => {
    const roomMembers = users.filter(user => user.room === roomName)
    return roomMembers
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}