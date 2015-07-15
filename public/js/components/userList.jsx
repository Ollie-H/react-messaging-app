var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var Link = require('react-router').Link;

var UserActions = require('../actions/UserActions');
var UserStore = require('../stores/UserStore');
var UserListItem = require('./userListItem.jsx');

var UserList = React.createClass({

	mixins: [UserStore.mixin],

	initialize: function(){
	},

	getInitialState: function() {
		return {
			search_open: false,
	        users: UserStore.getAllUsers()
	    };
	},

	componentDidMount: function() {

		this.props._authCheck();

		// Send action
		UserActions.getAllUsers();

	},

	storeDidChange: function(){

		// Get and set new state
		this.setState({ users: UserStore.getAllUsers() });

	},

	UsersList: function(){

		console.log(this.state.users);

		if(this.state.users.length == 0){
			return (
				<div className="user-list__item user-list__item--center">
					<div className="user-list__info">
						<span className="user-list__name"><p>No users found</p></span>
					</div>
				</div>
			);
		}

		return(
			<div>
				{
					this.state.users.map(function(user, index){
						return <UserListItem {...this.props} user={user} />
					},this)
				}
			</div>
		);

	},

	render: function() {

		return ( 
			<div className="row">
				<header className="fixed-nav">
					<div className="fixed-nav__left">
						<i className="fa"></i>
					</div>
					<div className="fixed-nav__text">
						Users
					</div>
					<div className="fixed-nav__right" onClick={this._handleClick}>
						<i className="fa fa-search"></i>
					</div>
				</header> 
				<div className="user-list">
					<div className={(this.state.search_open ? "show" : "") + " user-list__search"}>
						<input type="text" ref="search" onKeyUp={this._handleSearch} placeholder="Search..." />
					</div>
					{ this.UsersList() }
				</div>
			</div>
		); 
	},

	_handleSearch: function(){

		var val = this.refs.search.getDOMNode().value;

		this.setState({ users: UserStore.getUsersBySearch(val) });

	},

	_handleClick: function(){

		this.setState({ search_open: !this.state.search_open });

	}

});

module.exports = UserList;