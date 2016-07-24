var socket = io();

socket.on('background color', function (color) {
    $('body').css({backgroundColor: color});
});

socket.on('connect', function(){
    $('#connect-msg').text('Connected!');
});

$(document).ready(function () {
    $('#admin').on("submit", function (e) {
        e.preventDefault();
        var color = $('#color-input').val();
        socket.emit('admin-color', color);
    })
});