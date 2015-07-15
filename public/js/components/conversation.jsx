var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var Link = require('react-router').Link;

var UserActions = require('../actions/userActions');
var UserStore = require('../stores/userStore');
var MessageActions = require('../actions/messageActions');
var MessageStore = require('../stores/messageStore');

var ConversationItem = require('./conversationItem.jsx');

var Conversation = React.createClass({

	mixins: [UserStore.mixin, MessageStore.mixin],

	flag: false,

	initialize: function(){
	},

	getInitialState: function() {
		return {
	        user: {
	        	username: ''
	        },
	        contacts: [],
	        messages: [],
	        user_id: this.props.params.userId
	    };
	},

	componentDidMount: function() {

		var user_id = this.props.params.userId;

		this.props._authCheck();

		// Send action
		if(!this.state.is_new){
			MessageActions.getMessagesByUserId(user_id);
		}
		
		UserActions.getUserById();

		window.channel.bind('new_message', function(data){
			MessageActions.getMessagesByUserId(user_id);
		});

		this._scrollMessages();

	},

	storeDidChange: function(){

		this.flag = false;

		// Get and set new state
		this.setState({
			user: UserStore.getUserById(this.state.user_id),
			contacts: UserStore.getAllUsers(),
			messages: MessageStore.getMessages()
		});

		this._scrollMessages();

	},

	UserDropDown: function(){


		if(this.state.user_id !== 'new' && _.has(this.state.user, 'username')){
			return this.state.user.username;
		}

		return (
			<select className="new-user" onChange={this._handleChange}>
				<option>--SELECT A USER TO MESSAGE--</option>
				{
					this.state.contacts.map(function(contact, index){
						return <option value={contact.id}>{contact.username}</option>
					},this)
				}
			</select>
		);

	},

	render: function() {

		return (
			<div className="row">
				<header className="fixed-nav">
					<a href="#" className="fixed-nav__left" onClick={this._handleBack}>
						<i className="fa fa-chevron-left"></i>
					</a>
					<div className="fixed-nav__text">
						{this.UserDropDown()}
					</div>
					<a href="#" className="fixed-nav__right">
						<i className="fa"></i>
					</a>
				</header>
				<div className="conversation">
					{
						this.state.messages.map(function(message, index){
							return <ConversationItem {...this.props} message={message} />
						},this)
					}
				</div>
				<div className="send-input">
					<form onSubmit={this._handleSubmit}>
						<textarea type="text" ref="message"></textarea>
						<button className="send-input__btn" type="submit">
							<i className="fa fa-paper-plane-o"></i>
							SEND
						</button>
					</form>
				</div>
			</div>
		); 
	},

	_handleChange: function(e){

		this.setState({'user_id': e.target.value});
		MessageActions.getMessagesByUserId(e.target.value);

	},

	_handleBack: function(e){

		e.preventDefault();

		this.props.router.transitionTo('messages');

	},

	_handleSubmit: function(e){

		e.preventDefault();

		if(this.flag){
			return;
		}

		MessageActions.saveMessage(this.refs.message.getDOMNode().value, this.state.user.id);

		this.flag = true;
		this._clearInput();

	},

	_scrollMessages: function(){

		window.scrollTo(0,document.body.scrollHeight);

	},

	_clearInput: function(){

		this.refs.message.getDOMNode().value = '';
	}

});

module.exports = Conversation;