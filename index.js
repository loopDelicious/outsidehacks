var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var geolib = require('geolib');
var clients = {}; //

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
        // if (typeof(clients[client.id]) == "object") {
        //     client[client.id].coords = latlng;
        // } else {
            clients[client.id] = {
                'coords': latlng,
                'first_appeared': Date.now(),
            }
        // }
    });



    // display logic:
    client.on('admin-color', function (color) {
        if (!clients[client.id]) {
            return;
        }
        var artist = clients[client.id].coords;
        // io.emit("background color", color);
        // calculate location
        var distance;
        for (var key in clients) {
            if (!clients.hasOwnProperty(key)) continue;
            if (!io.sockets.connected[key]) {
                delete clients[key];
                continue;
            }

            distance = geolib.getDistance(
                {latitude: clients[key].coords.lat, longitude: clients[key].coords.lng},
                {latitude: artist.lat, longitude: artist.lng}
            );
            // emit to a specific client id

            io.sockets.connected[key].emit('background color', {
                color: color,
                distance: distance,
            });
        }
    });

    client.on('client-list', function() {
        client.emit("clients", clients);
    });

    client.on('refresh', function() {
        io.emit("refresh");
    });

});




http.listen(3000, function () {
    console.log('listening on *:3000');
});


