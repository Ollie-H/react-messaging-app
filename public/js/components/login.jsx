var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var Link = require('react-router').Link;

var UserActions = require('../actions/userActions');
var UserStore = require('../stores/userStore');

var Login = React.createClass({

	mixins: [UserStore.mixin],

	initialize: function(){
	},

	getInitialState: function() {
		return {
	        user: UserStore.getCurrentUser(),
	        error: ''
	    };
	},

	componentDidMount: function() {

		this.props._authCheck('login');

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
					<input type="text" id="inputEmail" ref="username" className="form-control" placeholder="Username" />
					<input type="password" id="inputPassword" ref="password" className="form-control" placeholder="Password" />
					<button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
					<Link to="signup" className="icon">Signup?</Link>
				</form>
			</div>
		); 
	},

	_handleLogin: function(e){

		e.preventDefault();

		UserActions.authenticate({
			username: this.refs.username.getDOMNode().value.toLowerCase(),
			password: this.refs.password.getDOMNode().value
		});

	}
});

module.exports = Login;