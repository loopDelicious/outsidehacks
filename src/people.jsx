var React = require ('react');

module.exports =  React.createClass({
    getInitialState: function(){
        return {
            people: []
        }
    },

    componentDidMount: function(){
        this.props.socket.emit('get-people');

        this.props.socket.on('get-people', function(people){
            this.setState({
                people: people
            });
        }.bind(this));

        this.props.socket.on('new-person', function(person){
            this.setState({
                people: this.state.people.push(person)
            });
        }.bind(this));
    },

    render: function(){
        var people = this.state.people.map((person)=>
            <div className="person" key={person.id} style={`top: ${person.top}; left: ${person.left}`}></div>
        );

        return <div>
            <div className="person me"></div>
            {people}
        </div>;
    }
});
