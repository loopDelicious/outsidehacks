var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var geolib = require('geolib');
var clients = {}; //
var bpm = 100;
var opacity = 0;
var bgcolor = 'black';
var speed = 10;
var djCoords = {
    lat: 0,
    lng: 0
};

app.use(express.static('static'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client.html');
});

app.get('/admin', function (req, res) {
    res.sendFile(__dirname + '/admin.html');
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

        distance = geolib.getDistance(
            {latitude: latlng.lat, longitude: latlng.lng},
            {latitude: djCoords.lat, longitude: djCoords.lng}
        );

        clients[client.id] = {
            coords: latlng,
            distance: distance,
            toDelay: latlng.toDelay,
        };

        client.emit('distance-update', distance);
    });



    // broadcast message to everyone including sender
    client.on('chat-message', function(msg){
        io.emit('chat-message', msg);
    });

    client.on('background-color', function(){
        client.emit('background-color', {
            color: bgcolor
        });
    });

    // opacity
    client.on('opacity', function(){
        client.emit('opacity', opacity);
    });
    client.on('admin-opacity', function(newOpacity){
        opacity = newOpacity;
        io.emit('opacity', opacity);
    });

    //bpm
    client.on('bpm', function(){
        client.emit('bpm', bpm);
    });
    client.on('admin-bpm', function(newBpm){
        bpm = newBpm;
        io.emit('bpm', bpm);
    });

    // propagation speed
    client.on('speed', function(){
        client.emit('speed', speed);
    });
    client.on('admin-speed', function(newSpeed){
        speed = newSpeed;
        io.emit('speed', speed);
    });


    client.on('get-people', function(){
        for (var key in clients) {
            if (!clients.hasOwnProperty(key)) continue;
            if (!io.sockets.connected[key]) {
                delete clients[key];
                continue;
            }
        }

        client.emit('people', clients);
    });



    // display logic:
    client.on('admin-color', function (color) {
        bgcolor = color;

        if (!clients[client.id]) {
            return;
        }
        djCoords = clients[client.id].coords;
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
                {latitude: djCoords.lat, longitude: djCoords.lng}
            );
            // emit to a specific client id
            io.sockets.connected[key].emit('background-color', {
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


