const moment = require('moment');

var generateMessage = (from, text, id=null) => {
    return {
        from,
        text,
        createdAt: generateDate(),
        id
    }
}

var generateLocationMessage = (from, latitude, longitude, id=null) => {
    return {
        from,
        url: `https://google.com/maps?q=${latitude},${longitude}`,
        createdAt: generateDate(),
        id
    }
}

var generateDate = () => {
    return new moment(new Date().getTime()).format('h:mm a')
}


var capitalize = (s) => {
    return s[0].toUpperCase() + s.slice(1);
}

module.exports = {generateMessage, generateLocationMessage, capitalize};