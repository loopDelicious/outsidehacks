var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  setTimeout(function(){
    socket.emit("background color", "blue");
  },1000);


  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log(msg)
  });


  socket.on('admin-color', function(color){
    io.emit("background color", color);
  })
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});


