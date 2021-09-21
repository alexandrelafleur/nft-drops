const cron = require('node-cron');
const express = require('express');
const axios = require("axios");

// console.log(xhr);

let config = {
    headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer DEEZ"
    }
}

let data = {
    'HTTP_CONTENT_LANGUAGE': "language"
}

// app = express();

// Schedule tasks to be run on the server.
cron.schedule('* * * * *', function () {
    console.log('running a task every minute');
    axios.post('http://localhost:3000/api/cron', data, config)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
});


// app.listen(3000);