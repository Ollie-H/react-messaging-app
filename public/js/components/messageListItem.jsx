var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var Link = require('react-router').Link;

var UserListItem = React.createClass({

	initialize: function(){
	},

	componentDidMount: function() { 
		console.log(this.props.user);
	}, 

	render: function() {
		return (
			<div className="user-list__item">
				<Link to="message" params={{userId: this.props.user.id}}>
					<div className={((!this.props.user.read_message) ? "unread" : "") + " user-list__info  user-list__info--messages"}>
						<span className="user-list__name">{this.props.user.username}</span>
						<span className="user-list__message">{this.props.user.message}</span>
						<i className="fa fa-chevron-right"></i> 
					</div>
				</Link>
			</div>
		); 
	}
});

module.exports = UserListItem;