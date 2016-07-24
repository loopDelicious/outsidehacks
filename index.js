var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('static'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });


    // display logic:

    socket.on('admin-color', function (color) {
        io.emit("background color", color);
    });

});

http.listen(3000, function () {
    console.log('listening on *:3000');
});


