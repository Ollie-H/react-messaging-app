var React = require('react');
var _ = require('underscore');
var $ = require('jquery');
var MessageActions = require('../actions/messageActions');
var mcFly = require('../dispatcher/mcflyDispatcher');

McFly = window.McFly || mcFly;

var _messages = [],
_inbox = [];

function addMessage(message){
    _messages.push(message);
}

function clearMessages(){
    _messages = [];
}

function clearInbox(){
    _inbox = [];
}

function getMessagesByUserId(userId){

   return new Promise(function(resolve, rej){

        var UserObject = Parse.Object.extend("User");
        var User = new UserObject();
        User.id = userId;

        var MessageObject = Parse.Object.extend("messages");
        var sent_by_user = new Parse.Query(MessageObject);
        sent_by_user.equalTo('user_from', Parse.User.current());
        sent_by_user.equalTo('user_to', User);

        var sent_to_user = new Parse.Query(MessageObject);
        sent_to_user.equalTo('user_from', User);
        sent_to_user.equalTo('user_to', Parse.User.current());

        var combined = Parse.Query.or(sent_by_user, sent_to_user);
        combined.ascending('createdAt');
        combined.include("user_from");
        combined.include("user_to");

        combined.find().then(function(results){

            _messages = [];

            for(i in results){

                var obj = results[i].attributes;
                var sender = (obj.user_from.id !== userId);

                if(!results[i].attributes.read_message && !sender){
                    results[i].set('read_message', true);
                    results[i].save(null);
                }

                _messages.push({
                    type: sender ? 'from' : 'to',
                    value: obj.value
                });
            }

            resolve();

        });

    });   

}


function getInbox(){

    return new Promise(function(resolve, rej){ 

        _messages = [];

        var MessageObject = Parse.Object.extend("messages");

        var sent_by_user = new Parse.Query(MessageObject);
        sent_by_user.equalTo('user_to', Parse.User.current());

        var sent_to_user = new Parse.Query(MessageObject);
        sent_to_user.equalTo('user_from', Parse.User.current());

        var combined = Parse.Query.or(sent_by_user, sent_to_user);
        combined.descending('createdAt');
        combined.include("user_to");
        combined.include("user_from");

        combined.find().then(function(results){

            var tmp = [];
            _inbox = [];

            for(i in results){

                var obj = results[i].attributes;
                var sender = obj.user_from.id === Parse.User.current().id;
                var user = (!sender) ? obj.user_from : obj.user_to;
                var message = obj.value;

                if(_.indexOf(tmp, user.id) === -1){
                    tmp.push(user.id);
                    _inbox.push({
                        id: user.id,
                        email: user.attributes.email,
                        username: user.attributes.username,
                        type: (sender) ? 'from' : 'to',
                        message: message,
                        read_message: (!sender) ? (obj.read_message || false) : true
                    });
                }
                else if(!sender && !obj.read_message){
                    _.map(_inbox, function(msg){
                        if(msg.id===user.id){
                            msg.unread = true;
                        }
                        return msg;
                    });
                }
                
            }

            resolve(); 

        });
        
    });

}

function saveMessage(data){

    return new Promise(function(resolve, rej){

        var MessageObject = Parse.Object.extend("messages");
        message = new MessageObject();

        message.set("user_from", { "__type": "Pointer", "className": "User", "objectId": Parse.User.current().id });
        message.set("user_to", { "__type": "Pointer", "className": "User", "objectId": data.userId });
        message.set("value", data.value);
        message.set("read_message", false);

        var acl = new Parse.ACL();
        acl.setPublicReadAccess(true);
        acl.setPublicWriteAccess(true);
        message.setACL( acl );
        
        message.save(null, {
            success: function(response){
                _messages.push({ type: 'from', value: data.value });
                $.post("/api", { event: 'new_message' });
                clearInbox();
                resolve();
            }
        });
        
    });
}

var MessageStore = McFly.createStore({

    getMessages: function(){
       return _messages;
    },

    getMessagesByUserId: function(){
        return _messages;
    },

    getInbox: function(){
        return _inbox;
    }

},function(payload){

    if(payload.actionType === "GET_MESSAGES_BY_USER_ID"){
        getMessagesByUserId(payload.userId).then(function(){
            MessageStore.emitChange();
        });
    }

    else if(payload.actionType === "SAVE_MESSAGE"){
        saveMessage(payload).then(function(){
            MessageStore.emitChange();
        });
    }

    else if(payload.actionType === "GET_INBOX"){
        getInbox(payload).then(function(){
            MessageStore.emitChange();
        });
    }

});

module.exports = MessageStore;