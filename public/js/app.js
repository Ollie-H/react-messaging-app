(function(window) {

	/* Include mcfly and set as global obj */
	var Mcfly = require('mcfly');
	window.Mcfly = new Mcfly();


	// var $ = require('jquery');
	var React = require('react/addons');
	var Router = require('react-router');

	/* The following are used as pseudo components for router */
	var Route = Router.Route;
	var NotFoundRoute = Router.NotFoundRoute;
	var DefaultRoute = Router.DefaultRoute; 
	var Link = Router.Link;
	var RouteHandler = Router.RouteHandler;
	var Redirect = Router.Redirect;

	/* Include components */
	var App = require('./components/app.jsx');
	var Login = require('./components/login.jsx');
	var Signup = require('./components/signup.jsx');
	var Conversation = require('./components/conversation.jsx');
	var UserList = require('./components/userList.jsx');
	var MessageList = require('./components/messageList.jsx');
	var Settings = require('./components/settings.jsx');

	/* Initialise parse with tokens - used for the storing and querying of all data */
	Parse.initialize("7IcNjhOmkzTeojbJryybj0a0f6zKkZ0Rdw8AavDd", "qQiOT4yPslvV0SqQn6YoBVzz8sRRbvoV0DTiLno8");

	/* Setup pusher object and attatch globally */
	window.pusher = new Pusher('a5a36045c48396dce7ed');
	window.channel = pusher.subscribe('messages');

	/* Setup routes */
	var routes = (
	    <Route handler={App}>

	        <DefaultRoute handler={MessageList} />

	        <Route name="home" handler={MessageList}/>
	        <Route name="login" handler={Login}/> 
	        <Route name="signup" handler={Signup}/> 
	        <Route name="users" handler={UserList} />
	        <Route name="settings" handler={Settings} />
	        <Route name="messages" handler={MessageList} path="/messages" />
        	<Route name="message" handler={Conversation} path="/messages/:userId"/>

        	<Redirect from="/" to="messages" />

	    </Route>
	);

	/* Call router.run, pass params into handler so they are available to components */
	Router.run(routes, Router.HistoryLocation, function (Handler, state) { 
	    var params = state.params;
	   	React.render(<Handler params={params} user={Parse.User.current()} router={this} />, document.body);
	});

})(window);