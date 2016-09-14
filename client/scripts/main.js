"use strict";

import * as ngSanitize from "angular-sanitize";

window.main_app = angular.module("MainApp", ["ngSanitize"]);

main_app.run(($http,$rootScope)=>{
$rootScope.messages = [];
$rootScope.login_user = {};
$rootScope.onlineUsers = {};  //Current online user list
$rootScope.onlineCount  = 0;  //Current online user count
$rootScope.send_content = "";
$rootScope.main_show_flag = false;
$rootScope.login_show_flag = true;
$rootScope.emotion_show_flag = false;

//scroll to bottom
$rootScope.scrollToBottom = function(){
    angular.element("#message_show").scrollTop(angular.element("#message_show")[0].scrollHeight);
    angular.element("#send_message").focus();
};

//get emotions
$http.get("/resources/emotion.json").success(function(response) {$rootScope.emotions = response;});

//wether the people had login
chrome.runtime.sendMessage({listen_type:'if_user_exit'},(response)=>{
    console.log(response);
    if(response != false && response.if_user_exit){
        $rootScope.main_show_flag = true;
        $rootScope.login_show_flag = false;
        $rootScope.messages = response.messages;
        $rootScope.reminder = response.reminder;
        $rootScope.onlineUsers = response.onlineUsers,
        $rootScope.onlineCount = response.onlineCount,
        $rootScope.login_user = response.login_user; 
        $rootScope.$apply();
        $rootScope.scrollToBottom();        
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{ 
    if(message != false && message.listen_type === 'login_success'){  　//when login
            $rootScope.onlineUsers = message.login_message.onlineUsers;   //Current online user list
            $rootScope.onlineCount = message.login_message.onlineCount;    //Current online user count
            message.login_message.message ? $rootScope.messages.push(message.login_message.message):""; 
            $rootScope.$apply();
            $rootScope.scrollToBottom();
    }  

    if(message != false && message.listen_type === 'logout_success'){  //when logout
        $scope.onlineUsers = obj.onlineUsers;    //Current online user list
        $scope.onlineCount = obj.onlineCount;    //Current online user count
        $scope.messages.push(obj.message);
        $rootScope.$apply();
        $rootScope.scrollToBottom();
     } 

    if(message != false && message.listen_type === 'send_message'){  // monitor message
        //show notification
        if(message.message.section_class === 'service'){
            sendResponse(true);
        }
        $rootScope.messages.push(message.message);
        $rootScope.send_content = "";  
        $rootScope.$apply(); 
        $rootScope.scrollToBottom(); 
    }
});
});

