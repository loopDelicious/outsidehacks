// set up main OutsideLights js object
var OL = {
    init: function(){
        this.socket = io();

        // update connection msg and start location loop
        this.socket.on('connect', function(){
            $('#connect-msg').text('Connected!');
            this.updateLocation();
        }.bind(this));

        // listen for background color events
        this.socket.on('background color', function (color) {
            $('body').css({backgroundColor: color});
        });

        // listen client-list events
        this.socket.on('clients', function (clientList) {
            $('#client-list').text(JSON.stringify(clientList, null, 4));
        });

        // set up admin functions
        $(document).ready(function () {
            $('#admin').on("submit", function (e) {
                e.preventDefault();
                var color = $('#color-input').val();
                this.socket.emit('admin-color', color);
            }.bind(this));
            $('#get-clients').on("submit", function (e) {
                e.preventDefault();
                this.socket.emit('client-list');
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
        }.bind(this), function(){
            alert('This app requires location access to work. Please update your browser settings and enable location for this page.');
        }, {
            enableHighAccuracy: true
        });
    },
};

OL.init();