var React = require('react');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var mcFly = require('../dispatcher/mcflyDispatcher');
McFly = window.McFly || mcFly;

var MessageActions = McFly.createActions({
    getInbox: function(){
      return {
          actionType: "GET_INBOX"
      }
    },
    getMessagesByUserId: function(userId){
      return {
          actionType: "GET_MESSAGES_BY_USER_ID",
          userId: userId
      }
    },
    saveMessage: function(value, userId){

      return {
          actionType: "SAVE_MESSAGE",
          value: value,
          userId: userId
      }
    }
});

module.exports = MessageActions;