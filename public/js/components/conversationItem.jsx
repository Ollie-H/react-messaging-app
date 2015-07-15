var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var Link = require('react-router').Link;

var Message = React.createClass({

	initialize: function(){
	},

	componentDidMount: function() { 
	}, 

	render: function() {
		return (
			<div className={"conversation__message conversation__message--"+this.props.message.type}>{this.props.message.value}</div>
		); 
	},

	_handleClick: function(){
		this.props._handleClick.call();
	}	
});

module.exports = Message;