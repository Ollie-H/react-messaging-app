var React = require('react');
var _ = require('underscore');
var mcFly = require('../dispatcher/mcflyDispatcher');
McFly = window.McFly || mcFly;

var _error = '',
    _users = [],
    _current_user = {};

function userAuthenticate(payload){

    return new Promise(function(resolve, rej){

        var user = new Parse.User(payload.user);
        var callbacks = {
            success: function(user) {
                if(user.error){
                    _error = user.error;
                    return;
                }
                _current_user = user;
                resolve();
            },
            error: function(user, error) {
                _error = "Invalid username or password. Please try again.";
                resolve();
            }
        };

        if(payload.actionType === "SAVE_USER"){
            user.signUp(null, callbacks);
        }
        else{
            user.logIn(callbacks);
        }

    });
}

function getUserById(userId){

    return _.findWhere(_users, {id: userId});

}

function getUsersBySearch(search){

    var _tmp = [];

    for(i in _users){
        if(_users[i].username.toLowerCase().indexOf(search.toLowerCase()) > -1){
            _tmp.push(_users[i]);
        }
    };

    return _tmp;

}

function getAllUsers(){

    return new Promise(function(resolve, rej){

        if(_users.length > 0){
            resolve();
            return;
        }

        var users= Parse.Object.extend("User");
        var query = new Parse.Query(users);

        query.find().then(function(results){

           for(i in results){

                if(Parse.User.current().id !== results[i].id){
                    
                    _users.push({
                        id: results[i].id,
                        email: results[i].attributes.email,
                        username: results[i].attributes.username
                    });
                }
               
            }

            resolve(); 

        });
    });

}


var UserStore = McFly.createStore({

    getCurrentUser: function(){

        if(Parse.User.current()){
            return Parse.User.current().attributes;
        }
        return _current_user;

    },
    getUserById: function(userId){
        return getUserById(userId);
    },
    getAllUsers: function(){
        return _users;
    },
    getError: function(){
        return _error;
    },
    getUsersBySearch: function(search){

        if(search===""){
            return _users;
        }

        return getUsersBySearch(search) || [];
    }   

},function(payload){

    if(
        payload.actionType === "SAVE_USER" || 
        payload.actionType === "AUTH_USER"
    ){
        userAuthenticate(payload).then(function(){
            UserStore.emitChange();
        });
    }
    else if(payload.actionType === "ALL_USERS" ||
            payload.actionType === "GET_USER_BY_ID"
    ){
        getAllUsers().then(function(){
            UserStore.emitChange();
        });

    }

});

module.exports = UserStore;