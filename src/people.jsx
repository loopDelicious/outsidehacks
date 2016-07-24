var React = require ('react');

module.exports =  React.createClass({
    timeouts: [],

    getInitialState: function(){
        return {
            people: {}
        }
    },

    componentDidMount: function(){
        this.props.socket.emit('get-people');

        this.props.socket.on('people', function(people){
            this.setState({
                people: people
            });
        }.bind(this));

        this.props.socket.on('new-person', function(person){
            this.setState({
                people: this.state.people.push(person)
            });
        }.bind(this));

        this.props.socket.on('background-color', function(color){
            this.oldColor = this.color;
            this.color = color.color;

            for (var i=0; i<this.timeouts.length; i++){
                window.clearTimeout(this.timeouts[i]);
            }

            this.timeouts = [];

            for (var key in this.state.people) {
                this.state.people[key].updated = false;
                this.timeouts.push(
                    window.setTimeout(function(){
                        this.state.people[key].updated = true;
                        this.setState({
                            people: this.state.people
                        }, function(){
                            this.forceUpdate();
                        });

                    }.bind(this), (10 - this.speed) * this.state.people[key].distance * 100)
                );

            }


        }.bind(this))
    },

    render: function(){
        var people = [];
        for (var key in this.state.people) {
            people.push(<div
                className="person"
                key={key}
                style={{
                    left: Math.floor((this.props.coords.lat - this.state.people[key].coords.lat) * 1000000 + 300) + 'px',
                    top: Math.floor((this.props.coords.lng - this.state.people[key].coords.lng) * 1000000 + 300) + 'px',
                    backgroundColor: this.state.people[key].updated ? this.color : this.oldColor
                }}>
            </div>)
        }

        return <div>
            <div className="person me" style={{
                left: 0 + 'px',
                top: 0 + 'px',
                backgroundColor: this.color
            }}></div>
            {people}
        </div>;
    }
});
