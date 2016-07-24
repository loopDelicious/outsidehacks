// set up main OutsideLights js object
var OL = {
    init: function(){
        this.socket = io();

        // update connection msg and start location loop
        this.socket.on('connect', function(){
            $('#connect-msg').text('Connected!');
            this.updateLocation();
        }.bind(this));

        // listen for bg color events
        this.socket.on('background color', function (color) {
            $('body').css({backgroundColor: color});
        });

        // set up admin functions
        $(document).ready(function () {
            $('#admin').on("submit", function (e) {
                e.preventDefault();
                var color = $('#color-input').val();
                socket.emit('admin-color', color);
            })
        });
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
    },
};

OL.init();