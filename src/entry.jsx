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
            this.socket.emit('bpm'); //request a beats per minute update

            var peopleProps = {
                socket: this.socket
            };
            ReactDOM.render(<People {...peopleProps} />, $('.people')[0]);
        }.bind(this));

        // listen for background-color events
        this.socket.on('background-color', function (data) {
            $('#distance').text(data.distance);
            this.updateBgColor(data.color);
        }.bind(this));

        // listen client-list events
        this.socket.on('clients', function (clientList) {
            $('#client-list').text(JSON.stringify(clientList, null, 4));
        });

        // listen for refresh request
        this.socket.on('refresh', function() {
            window.location.reload();
        });

        this.socket.on('bpm', function(bpm) {
            this.bpm = bpm;

            $('body').css({animationDuration: (1 / (bpm / 60)) + 's'});

            console.log('new bpm ' + bpm);

            if (!window.isAdmin) {
                return;
            }

            $("#slider").val(bpm);
            $("#slider_val").val(bpm);
        }.bind(this));

        // client to server chat message
        $('#chat').submit(function(e){
            e.preventDefault();
            this.socket.emit('chat-message', $('#m').val());
            $('#m').val('');
            return false;
        }.bind(this));

        // send out
        this.socket.on('chat-message', function(msg){
            io.emit('chat-message', msg);
        });

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

            $("#slider").on("input", function(){
                $("#slider_val").val(this.value);
                console.log('changing bpm to ', this.value);
                self.socket.emit('admin-bpm', this.value);
            });

            $("#slider_val").on('keyup', function(){
                $("#slider").val(this.value);
                console.log('changing bpm to ', this.value);
                self.socket.emit('admin-bpm', this.value);
            });



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
    },

    updateBgColor: function(color){
        var
            stylesheet = document.styleSheets[1] // replace 0 with the number of the stylesheet that you want to modify
            , rules = stylesheet.rules
            , i = rules.length
            , keyframes
            , keyframe
            ;

        while (i--) {
            keyframes = rules.item(i);
            var type = keyframes.type;
            if (
                (
                    keyframes.type === keyframes.KEYFRAMES_RULE
                    || keyframes.type === keyframes.WEBKIT_KEYFRAMES_RULE
                )
                && keyframes.name === "example"
            ) {
                rules = keyframes.cssRules;
                i = rules.length;
                while (i--) {
                    keyframe = rules.item(i);
                    if (
                        (
                            keyframe.type === keyframe.KEYFRAME_RULE
                            || keyframe.type === keyframe.WEBKIT_KEYFRAME_RULE
                        )
                        && keyframe.keyText === "50%"
                    ) {
                        keyframe.style.backgroundColor = color;
                        break;
                    }
                }
                break;
            }
        }
    }
};

OL.init();

