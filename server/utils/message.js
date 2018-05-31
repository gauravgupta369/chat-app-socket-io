const moment = require('moment');

var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: generateDate()
    }
}

var generateLocationMessage = (from, latitude, longitude) => {
    return {
        from,
        url: `https://google.com/maps?q=${latitude},${longitude}`,
        createdAt: generateDate()
    }
}

var generateDate = () => {
    return new moment(new Date().getTime()).format('h:mm a')
}


module.exports = {generateMessage, generateLocationMessage};