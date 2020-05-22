const socket = require('socket.io-client')('http://localhost:5000')
const prompt = require('prompt')
const colors = require('colors/safe');

let username = ""

prompt.message = ''
prompt.delimeter = ''

prompt.get({
    name: 'uname',
    description: colors.green('Enter username'),
    pattern: /[a-zA-Z0-9]/,
    message: 'Invalid characters in username'
}, (err, inp) => {
    if (err) {
        // console.log('Error registering username')
    }
    if (inp == undefined) {
        console.log(colors.bold("bye"))
        socket.emit('left')
        return socket.close()
        // socket.close()
    }
    username = inp.uname
    socket.emit('client-connect', username)
    console.log(`Joined as ${colors.yellow(username)}`)
    console.log(`Press ${colors.bold('^C')} or type ${colors.bold('exit')} to leave\n\n`)
    inputMessage()
})

socket.on('chat-message', (message) => {
    if (message[0] == username) {
        console.log(`You: ${message[1]}`)
    }
    else {
        console.log(`\b\b\b\b\b\b${colors.blue.bold(message[0])}: ${message[1]}`)
    }
})

function inputMessage() {
    prompt.start()
    prompt.get({
        name: 'messageinput',
        description: '\b\b\b',
        message: 'Invalid characters in username'
    }, (err, inp) => {
        if (err) {
            // console.log('Error')
        }
        if (inp == undefined || inp.messageinput == "exit") {
            console.log(colors.bold.yellow("bye"))
            socket.emit('left')
            return socket.close()
            // socket.close()
        }
        socket.emit('message', inp.messageinput)
        inputMessage()
    })
}


socket.on('chat-info', info => {
    console.log(`\b\b\b\b\b\b${colors.yellow(info)}`)
})