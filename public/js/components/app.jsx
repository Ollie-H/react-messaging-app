var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var Router = require('react-router');

var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var UserActions = require('../actions/userActions');
var UserStore = require('../stores/userStore');

var App = React.createClass({

	mixins: [UserStore.mixin],

	initialize: function(){},

	getInitialState: function() {

		return {
			'user' : UserStore.getCurrentUser(),
			'show_nav': false
		};

	},

	storeDidChange: function(){

		this.setState({ user: UserStore.getCurrentUser() });

	},

	componentDidMount: function() {

		this._authCheck('login');

	}, 

	UserNavigation: function(){

		if(!this.state.show_nav){
			return '';
		}

		return (
			<footer className="footer">
				<div className="footer__links">
					<Link to="messages" className="icon">
						<i className="fa fa-comments"></i>
					</Link>
					<Link to="users" className="icon">
						<i className="fa fa-users"></i>
					</Link>
					<Link to="settings" className="icon">
						<i className="fa fa-cog"></i>
					</Link>
				</div>
			</footer>
		);

	},


	render: function() {

		return (
			<div>
				<main>
					<RouteHandler {...this.props} navChange={this._navChange} _authCheck={this._authCheck} />
				</main>
				<div>{this.UserNavigation()}</div>
			</div>
		); 
	},

	_authCheck: function(page){


		if((page !== 'signup' && page !== 'login') && !Parse.User.current()){
			this.setState({'show_nav': false});
			this.props.router.transitionTo('/login');
			return;
		}

		if(page === 'signup' || page === 'login'){

			if(Parse.User.current()){

				this.setState({'show_nav': true});
				this.props.router.transitionTo('/');
			}
			return;
		}

	}

});

module.exports = App;