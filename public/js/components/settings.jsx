var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var Link = require('react-router').Link;

var UserActions = require('../actions/userActions');
var UserStore = require('../stores/userStore');

var Settings = React.createClass({

	mixins: [UserStore.mixin],

	initialize: function(){
	},

	getInitialState: function() {
		return {
	        user: Parse.User.current() ? Parse.User.current().attributes : {}
	    };
	},

	componentDidMount: function() {

		this.props._authCheck();

	},

	storeDidChange: function(){

		this.props._authCheck();

	},

	render: function() {
		return (
			<div className="row">
				<header className="fixed-nav">
					<div className="fixed-nav__left" onClick={this._handleBack}>
						<i className="fa fa-chevron-left"></i>
					</div>
					<div className="fixed-nav__text">
						Settings
					</div>
					<div className="fixed-nav__right">
						<i className="fa fa-sign-out" onClick={this._handleLogout}></i>
					</div>
				</header>
				<form className="profile" onSubmit={this._handleSave}>
					<div className="settings">
						<div className="settings__row"></div>
						<div className="settings__row"></div>
						<div className="settings__row"></div>
						<div className="settings__row"></div>
						<a className="settings__row settings__logout" onClick={this._handleLogout}>
							Logout
						</a>
					</div>
				</form>
			</div>
		); 
	},

	_handleLogout: function(){

		var self = this;

		Parse.User.logOut().then(function(){
			self.props._authCheck();
		});
	},

	_handleSave: function(){
	},

	_handleBack: function(){
		this.props.router.transitionTo('/');
	}

});

module.exports = Settings;