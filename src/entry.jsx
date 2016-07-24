var $ = require ('jquery');
var io = require ('socket.io-client');
var React = require ('react');
var ReactDOM = require ('react-dom');
var People = require('./people.jsx');

// set up main OutsideLights js object
var OL = {
    init: function(){
        this.socket = io();

        // update connection msg and start location loop
        this.socket.on('connect', function(){
            $('#connect-msg').hide();
            this.updateLocation();

            var peopleProps = {
                socket: this.socket
            };
            ReactDOM.render(<People {...peopleProps} />, $('.people')[0]);
        }.bind(this));

        // listen for background color events
        this.socket.on('background color', function (color) {
            $('body').css({backgroundColor: color});
        });

        // listen client-list events
        this.socket.on('clients', function (clientList) {
            $('#client-list').text(JSON.stringify(clientList, null, 4));
        });

        // listen for refresh request
        this.socket.on('refresh', function() {
            window.location.reload();
        })

        // set up admin functions
        $(document).ready(function () {
            var self = this;
            $('#color-picker td').on("click", function (e) {
                e.preventDefault();
                var color = $(this).attr('bgcolor');
                self.socket.emit('admin-color', color);
            });
            $('#get-clients').on("submit", function (e) {
                e.preventDefault();
                this.socket.emit('client-list');
            }.bind(this));
            $('#refresh-form').on("submit", function(e) {
                e.preventDefault();
                this.socket.emit('refresh');
            }.bind(this));
        }.bind(this));
    },

    updateLocation: function(){
        navigator.geolocation.getCurrentPosition(function (data) {
            this.socket.emit('location-update', {
                lat: data.coords.latitude,
                lng: data.coords.latitude
            });
            setTimeout(this.updateLocation.bind(this), 3000); // update location every 3s
        }.bind(this), function(error){
            if (error.code === PositionError.PERMISSION_DENIED) {
                alert('This app requires location access to work. Please update your browser settings and enable location for this page.');
            }
        }, {
            enableHighAccuracy: true
        });
    }
};

OL.init();

