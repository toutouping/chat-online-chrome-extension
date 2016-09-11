let socket ;
let messages = []; 
let onlineUsers = {};
let onlineCount = 0;
let login_user = {}; 
const url = 'http://www.choldrim.com:3001/';


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
                    section_class : section_class
                }    
                messages.push(message);
                chrome.runtime.sendMessage({listen_type:'send_message',message:message});
            });
        }
    }  
     /////////////To determine whether the user has login
    if(message.listen_type === 'if_user_exit'){
        if(login_user.userid){  // user exist
       　   sendResponse({if_user_exit:true,login_user:login_user,onlineUsers:onlineUsers,onlineCount:onlineCount,messages:messages});
        }else{  //if user dosen't exist
            messages = [];
            onlineUsers = {};
            onlineCount = 0;
            login_user = {}; 
            sendResponse({if_user_exit:false});
        }
    }  
    /////////////send messages
    if(message.listen_type === 'send'){
       　socket.emit('message', message.send_obj); 
    }  
    ///////////// lagout
    if(message.listen_type === 'logout'){ 
        socket.disconnect(); // Notify the browser to close the connection
        messages = [];
        login_user = {}; 
    }     
});

