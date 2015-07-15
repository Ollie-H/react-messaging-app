var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var Link = require('react-router').Link;

var UserListItem = React.createClass({

	initialize: function(){
	},

	componentDidMount: function() { 
	}, 

	render: function() {
		return (
			<div className="user-list__item">
				<Link to="message" params={{userId: this.props.user.id}}>
					<div className="user-list__info">
						<span className="user-list__name">{this.props.user.username}</span>
						<i className="fa fa-chevron-right"></i>
					</div>
				</Link>
			</div>
		); 
	}
});

module.exports = UserListItem;