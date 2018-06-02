const path = require('path');
const express = require('express');
const app = express();
const socketIO = require('socket.io');
const http = require('http');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

const server = http.createServer(app);

const io = socketIO(server)

const users = new Users();

io.on('connection', (socket) => {
    
    socket.on('join', (data, callback) => {
        let name = data.name.toLowerCase().replace(/\s/g,'');
        let room = data.room.toLowerCase();

        if (!isRealString(name) || !isRealString(room)) {
            return callback('Invalid Data!');
        }

        if (users.checkUserName(name, room)) {
            return callback('urer with same username is already in the room.');
        }

        socket.join(room);
        users.removeUser(socket.id);
        users.addUser(socket.id, name, room);

        io.to(room).emit('updateUserList', users.getUserList(room));
        socket.broadcast.to(room).emit('newMessage',  generateMessage('Admin', `${name} has Joined.`));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chatApp.'));
        callback();
    });
    

    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);
        console.log(user);
        if(user && isRealString(message.text)) {
            return io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();
    });

    socket.on('createLocationMessage', (position, callback) => {
        let user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage('Admin', position.latitude, position.longitude));
        }
        callback();
    });

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            socket.broadcast.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });

});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});