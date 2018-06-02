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
        if (!isRealString(data.name) || !isRealString(data.room)) {
            return callback('Invalid Data!');
        }
        socket.join(data.room);

        users.removeUser(socket.id);
        users.addUser(socket.id, data.name, data.room);

        io.to(data.room).emit('updateUserList', users.getUserList(data.room));
        socket.broadcast.to(data.room).emit('newMessage',  generateMessage('Admin', `${data.name} has Joined.`));
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
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        socket.broadcast.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    });

});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});