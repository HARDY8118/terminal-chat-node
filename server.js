const io = require('socket.io')(5000)

users=[]

io.on('connection', socket => {
    console.log(`new connection: ${socket.id}`)

    socket.on('client-connect',(name)=>{
        users[socket.id]=name
        console.log(`${name} connected`)
        socket.broadcast.emit('chat-info',`${users[socket.id]} has joined`)
        // if(users.length>1){
            // io.emit('Connected')
        // }
        console.log(users)
    })

    socket.on('message',(message)=>{
        socket.broadcast.emit('chat-message',[users[socket.id],message])
    })

    socket.on('left',()=>{
        socket.broadcast.emit('chat-info',`${users[socket.id]} has left`)
        delete users[socket.id]
    })
})