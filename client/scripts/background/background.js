var socket ;
var messages = []; 
var onlineUsers = {};
var onlineCount = 0;
var login_user = {}; 
var message_count = 0; 
var reminder = false;
const url = 'ws://www.choldrim.com:3001/';  //www.choldrim.com:3001  localhost:3001

//chrome.webNavigation
function updateIcon() {
  if (message_count === 0) {
    chrome.browserAction.setIcon({path:"./images/48.png"});
    chrome.browserAction.setBadgeBackgroundColor({color:''});
    chrome.browserAction.setBadgeText({text:""});
  } else {
    chrome.browserAction.setIcon({path: "./images/48.png"});
    chrome.browserAction.setBadgeBackgroundColor({color:[208, 0, 24, 255]});
    chrome.browserAction.setBadgeText({text: message_count + ''});
  }
}

// listening
chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    ///////////// a new user has login
    if(message.listen_type === 'login'){
        if(!login_user.userid){  
            login_user = message.login_user;
             //Link server
            socket = io.connect(url); 
            socket.emit('login',login_user); 
            //Monitor new user login
            socket.on('login', function(obj){
                onlineUsers = obj.onlineUsers;   //Current online user list
                onlineCount = obj.onlineCount;    //Current online user count
                if(obj.message){
                   messages.push(obj.message); 
                   chrome.runtime.sendMessage({listen_type:'login_success',login_message:obj});  
                }
            });

            //Listener user exist
            socket.on('logout', function(obj){ 
                message_count = 0;
                updateIcon();
                onlineUsers = obj.onlineUsers;   //Current online user list
                onlineCount = obj.onlineCount;    //Current online user count
                messages.push(obj.message);
                chrome.runtime.sendMessage({listen_type:'logout_success',logout_message:obj});
            });  
            //Monitor sending message 
            socket.on('message', function(obj){
                let is_login_user = (obj.userid === login_user.userid) ? true : false;
                let section_class ='';
                let section_type= '';
                if(is_login_user){
                    section_class = 'user';
                    section_type  =2;
                } else { 
                    section_class = 'service';
                    section_type  =3;
                } 
                let message = { 
                    section_type : section_type,
                    content1 : obj.username,
                    content2 : obj.content,
                    content_type : obj.content_type,
                    section_class : section_class
                }    
                messages.push(message);
                chrome.runtime.sendMessage({listen_type:'send_message',message:message},(response)=>{
                    if(!response && !is_login_user){
                        //chrome.notifications api
                        if(reminder){
                            let notifi_content = '';
                            if(obj.content_type === 'emotion'){
                                notifi_content = '发来表情' 
                            }else if (obj.content_type === 'image'){
                                notifi_content = '发来图片' 
                            }else{
                                notifi_content = obj.content_type
                            }
                            new Notification(obj.username, {icon: './images/48.png',body: notifi_content});
                        }
                        message_count++;
                        updateIcon();
                    }  
                });
            });
        }
    }  
     /////////////To determine whether the user has login
    if(message.listen_type === 'if_user_exit'){
        message_count= 0;
        updateIcon();
        if(login_user.userid){  // user exist
       　   sendResponse({if_user_exit:true,login_user:login_user,onlineUsers:onlineUsers,onlineCount:onlineCount,reminder:reminder,messages:messages});
        }else{  //if user dosen't exist
            messages = [];
            message_count = 0;
            onlineUsers = {};
            onlineCount = 0;
            login_user = {};
            reminder = false;
            sendResponse({if_user_exit:false});
        }
    }  
    /////////////send messages
    if(message.listen_type === 'send'){
       socket.emit('message', message.send_obj); 
    }  
    ///////////// change_reminder
    if(message.listen_type === 'change_reminder'){
       reminder = message.reminder;
    }    
    ///////////// lagout
    if(message.listen_type === 'logout'){ 
        socket.disconnect(); // Notify the browser to close the connection
        messages = [];
        reminder = false;
        login_user = {}; 
    }     
});

