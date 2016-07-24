var socket = io();

socket.on('background color', function (color) {
    $(body).css({backgroundColor: color});
});

socket.on('connection', function(){
    $('connect-msg').text('connected');
});

$(document).ready(function () {
    $('#admin').on("submit", function (e) {
        e.preventDefault();
        var color = $('#color-input').val();
        socket.emit('admin-color', color);
    })
});