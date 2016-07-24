var $ = require ('jquery');
var io = require ('socket.io-client');
var React = require ('react');
var ReactDOM = require ('react-dom');
var People = require('./people.jsx');

// set up main OutsideLights js object
var OL = {
    init: function(){
        this.socket = io();
        this.opacity = 0;
        this.$flash = $('#flash');
        this.$body = $('body');

        // update connection msg and start location loop
        this.socket.on('connect', function(){
            $('#connect-msg').hide();
            this.updateLocation();
            this.socket.emit('bpm'); //request a beats per minute update
            this.socket.emit('opacity'); //request an opacity update
            this.socket.emit('background-color'); //request an opacity update

            var peopleProps = {
                socket: this.socket
            };
            ReactDOM.render(<People {...peopleProps} />, $('.people')[0]);
        }.bind(this));

        // listen for background-color events
        this.socket.on('background-color', function (data) {
            $('#distance').text(data.distance);
            window.setTimeout(function(){
                this.bgcolor = data.color;
                this.$body.css({backgroundColor: this.bgcolor});
            }.bind(this), data.distance * 100);
            if (window.isAdmin) {
                this.$body.css({backgroundColor: this.bgcolor});
            }
        }.bind(this));

        this.socket.on('distance-update', function (distance) {
            $('#distance').text(distance);
        });

                // listen client-list events
        this.socket.on('clients', function (clientList) {
            $('#client-list').text(JSON.stringify(clientList, null, 4));
        });

        // listen for refresh request
        this.socket.on('refresh', function() {
            window.location.reload();
        });

        this.socket.on('opacity', function(opacity) {
            this.opacity = opacity;

            if (!window.isAdmin) {
                return;
            }

            $("#opacity_slider").val(Math.ceil(opacity*100));
            $("#opacity_val").text(Math.ceil(opacity*100));
        }.bind(this));

        this.socket.on('bpm', function(bpm) {
            this.bpm = bpm;

            if (!window.isAdmin){
                this.flash();
            }

            //console.log('new bpm ' + bpm);

            if (!window.isAdmin) {
                return;
            }

            $("#slider").val(bpm);
            $("#slider_val").val(bpm);
        }.bind(this));

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

            $("#opacity_slider").on("input", function(){
                $("#opacity_val").text(this.value);
                //console.log('changing opacity to ', this.value);
                self.socket.emit('admin-opacity', this.value / 100);
            });

            $("#slider").on("input", function(){
                $("#slider_val").val(this.value);
                //console.log('changing bpm to ', this.value);
                self.socket.emit('admin-bpm', this.value);
            });

            $("#slider_val").on('keyup', function(){
                $("#slider").val(this.value);
                //console.log('changing bpm to ', this.value);
                self.socket.emit('admin-bpm', this.value);
            });



        }.bind(this));
    },

    flash(){
        var msDelay = (((1 / (this.bpm / 60)) / 2 ) * 1000);
        console.log(msDelay);
        this.$flash.stop().animate({opacity: 0}, msDelay, 'swing', function() {
            this.$flash.animate({opacity: this.opacity}, msDelay, 'swing', function() {
                this.flash();
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
            if (error.code === 1) { // 1 == PositionError.PERMISSION_DENIED
                alert('This app requires location access to work. Please update your browser settings and enable location for this page.');
            }
        }, {
            enableHighAccuracy: true
        });
    }
};

OL.init();

