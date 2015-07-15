var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var Link = require('react-router').Link;

var UserActions = require('../actions/userActions');
var UserStore = require('../stores/userStore');

var Signup = React.createClass({

	mixins: [UserStore.mixin],

	initialize: function(){
	},

	getInitialState: function() {
		return {
	        user: UserStore.getCurrentUser(),
	        error: '',
	    };
	},

	componentDidMount: function() {

		this.props._authCheck('signup');

	},

	storeDidChange: function(){

		this.setState({ user: UserStore.getCurrentUser().attributes, error : UserStore.getError() });
		this.props._authCheck('login');
	},

	render: function() {
		return (
			<div className="row">
				<form className="signin" onSubmit={this._handleLogin}>
					<div className={((!this.state.error) ? "hidden " : "") + "alert alert-danger"} role="alert">
					  <span className="fa fa-exclamation-circle" aria-hidden="true"></span>
					  {this.state.error}
					</div>
					<input type="text" ref="username" className="form-control" placeholder="Username" />
					<input type="text" ref="email_address" className="form-control" placeholder="Email Address" />
					<input type="password" id="inputPassword" ref="password" className="form-control" placeholder="Password" />
					<button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
					<Link to="login" className="icon">Already registered, login?</Link>
				</form>
			</div>  
		); 
	},

	_setError: function(message){

		this.setState({ 'error' : message });

	},

	_validateForm: function(){


		return new Promise(function(resolve, rej){

			if(this.refs.username.getDOMNode().value === ""){
				this._setError('Please enter a username');
			}
			else if(this.refs.email_address.getDOMNode().value === ""){
				this._setError('Please enter an email address');
			}
			else if(this.refs.password.getDOMNode().value === ""){
				this._setError('Please enter a password');
			}
			else{
				this._setError('');
				resolve();
			}

		}.bind(this));

	},

	_handleLogin: function(e){

		e.preventDefault();

		this._validateForm().then(function(){

			UserActions.signup({
				username: this.refs.username.getDOMNode().value.toLowerCase(),
				email: this.refs.email_address.getDOMNode().value.toLowerCase(),
				password: this.refs.password.getDOMNode().value
			});

		}.bind(this));

	}
});

module.exports = Signup;