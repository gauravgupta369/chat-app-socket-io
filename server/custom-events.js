const path = require('path');
const express = require('express');
const app = express();
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

const server = http.createServer(app);

const io = socketIO(server)

// indivisual socket of users
io.on('connection', (socket) => {
    console.log('New User Connected!');
    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });

    socket.emit('newEmail', {
        from: 'gaurav.gupta@voicetree.co',
        text: 'This is a dummy email',
        createdAt: 'today'
    });

    socket.on('createEmail', (newEmail) => {
        console.log('New Email ', newEmail);
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});