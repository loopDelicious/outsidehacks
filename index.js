var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = {}; // 
//socket id: [location, color, last message / pic
//find id on location update

app.use(express.static('static'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (client) {
    console.log('a user connected');
    client.on('disconnect', function () {
        console.log('user disconnected');
    });

    // update location
    client.on('location-update', function(latlng){
        // if user in clients, push location
        // otherwise create new client and push location
        if (typeof(clients[client.id]) == "object") {
            client[client.id].coords = latlng;
        } else {
            clients[client.id] = {
                'coords': latlng,
                'first_appeared': Date.now(),
            }
        }
    });
    // display logic:

    client.on('admin-color', function (color) {
        io.emit("background color", color);
    });

    client.on('admin-listclients', function() {
        client.emit("clients", clients);
    });

});




http.listen(3000, function () {
    console.log('listening on *:3000');
});


