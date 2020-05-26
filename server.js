const io = require('socket.io')(5000)
const mongoose = require('mongoose')

users = []

mongoose.connect('mongodb://localhost:27017/socket_terminal', { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
    console.log('Failed to connect to server')
})

const messageModel = mongoose.model('messages', new mongoose.Schema({
    ts: Date,
    msg: String,
    from: String
}))

io.on('connection', socket => {
    async function loadPrevious() {
        const msgs = await messageModel.find({}, { "ts": 1, "msg": 1, "from": 1, "_id": 0 }).sort('ts')
        for (msg of msgs) {
            // console.log(msg.msg)
            const d = new Date(msg.ts)
            socket.emit('chat-message', [msg.from, msg.msg, `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}`.padStart(40)])
        }
    }

    console.log(`new connection: ${socket.id}`)

    socket.on('client-connect', (name) => {
        users[socket.id] = { name }
        console.log(`${name} connected`)
        socket.broadcast.emit('chat-info', `${users[socket.id].name} has joined`)
        console.clear()
        console.table(users)
        socket.emit('chat-info', `Loading previous messgaes`)
        loadPrevious()

        // loadPrevious()
    })

    socket.on('message', (message) => {
        messageModel.create({ ts: new Date(), msg: message, from: users[socket.id].name }, (err, s) => {
            if (err) {
                socket.emit('chat-error', `Failed to send!`)
            } else {
                socket.broadcast.emit('chat-message', [users[socket.id].name, message])
            }
        })
    })

    socket.on('left', () => {
        socket.broadcast.emit('chat-info', `${users[socket.id].name} has left`)
        delete users[socket.id]
        console.clear()
        console.table(users)
    })
})

console.clear()
console.table(users)
