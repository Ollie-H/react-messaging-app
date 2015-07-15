var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var Link = require('react-router').Link;

var MessageActions = require('../actions/messageActions');
var MessageStore = require('../stores/messageStore');
var MessageListItem = require('./messageListItem.jsx'); 

var MessageList = React.createClass({

	mixins: [MessageStore.mixin],

	initialize: function(){
	},

	getInitialState: function() {
		return {
	        users: MessageStore.getInbox()
	    };
	},

	componentDidMount: function() {

		this.props._authCheck();
		// Send action
		MessageActions.getInbox();

		window.channel.bind('new_message', function(data){
			MessageActions.getInbox();
		});

	},

	storeDidChange: function(){
		// Get and set new state
		this.setState({ users: MessageStore.getInbox() });
	},

	render: function() {

		return ( 
			<div className="row">
				<header className="fixed-nav">
					<a href="" className="fixed-nav__left">
						<i className="fa"></i>
					</a>
					<div className="fixed-nav__text">
						Messages (18)
					</div>
					<a href="" className="fixed-nav__right" onClick={this._handleClick}>
						<i className="fa fa-pencil-square-o"></i>
					</a>
				</header> 
				<div className="user-list">
					{
						this.state.users.map(function(user, index){
							return <MessageListItem {...this.props} user={user} />
						},this)
					}
				</div>
			</div>
		); 
	},

	_handleClick: function(e){

		e.preventDefault();

		this.props.router.transitionTo('message', { userId: 'new' });

	}

});

module.exports = MessageList;