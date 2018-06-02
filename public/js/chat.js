var socket = io();

socket.on('connect', () => {
    var param = $.deparam(window.location.search);
    socket.emit('join', param, function(err) {
        if(err) {
            alert(err);
            window.location.href = '/'; 
        } else {

        }
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected from server!');
});


socket.on('newMessage', function (message) {
    console.log('newMessage', message);

    var messageTemplate = $('#message-template').html();
    var html = Mustache.render(messageTemplate, {
        text: message.text,
        from: message.from,
        createdAt: message.createdAt
    })
    $('#messages').append(html);
    scrollToBottom();

});

socket.on('newLocationMessage', function(message) {
    console.log(message);

    var locationTemplate = $('#location-message-template').html();
    var html = Mustache.render(locationTemplate, {
        url: message.url,
        from: message.from,
        createdAt: message.createdAt
    })
    $('#messages').append(html);
    scrollToBottom();
});

socket.on('updateUserList', function(userList) {
    var ol = $('<ol></ol>');
    userList.forEach(user => {
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol);
});

$('#message-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit('createMessage', {
        text: $('#message').val()
    }, function() {alert('Invalid Message!')} );
    $('#message').val('');
});


var locationButton = $('#send-location');

locationButton.on('click', function() {
    if(! navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    var sendLocation = $('#send-location');
    sendLocation.text('Sending location...');
    sendLocation.attr('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function() {
            sendLocation.text('Send Location');
            sendLocation.removeAttr('disabled');
        });
    }, function() {
        alert('Unable to fetch location');
    })
});

function scrollToBottom() {
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    var scrollTop = messages.prop('scrollTop');
    var clientHeight = messages.prop('clientHeight');
    var scrollHeight = messages.prop('scrollHeight');

    if (scrollTop + clientHeight + lastMessageHeight + newMessageHeight + 30 >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}