var React = require('react');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var mcFly = require('../dispatcher/mcflyDispatcher');
McFly = window.McFly || mcFly;

var UserActions = McFly.createActions({
    authenticate: function(user){
        return {
            actionType: "AUTH_USER",  
            user: user
        }
    },
    signup: function(user){
        return {
            actionType: "SAVE_USER",  
            user: user
        }
    },
    getAllUsers: function(){
        return {
            actionType: "ALL_USERS"
        }
    },
    getUserById: function(userId){
        return {
            actionType: "GET_USER_BY_ID",
            userId: userId
        }
    }
});

module.exports = UserActions;