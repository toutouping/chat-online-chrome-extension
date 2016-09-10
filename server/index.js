var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.send('<h1>Hello,server listening on *:3001</h1>');
});

//online users list
var onlineUsers = {};
//online users count
var onlineCount = 0;

io.on('connection', function(socket){
	console.log('one connected'); 
 
	//listening login
	socket.on('login', function(obj){
		//check person is online
		if(!onlineUsers.hasOwnProperty(obj.userid)) {
			socket.name = obj.userid; 
			onlineUsers[obj.userid] = obj.username; 
			onlineCount++;
		    //messages
	        let message = { 
	            section_type : 1,
	            content1 : obj.username + ' joined the chat room',
	            content2 : '',
	            section_class : 'system'
	        }  
			//Broadcast to all clients
			io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, message:message});
			console.log(obj.username+' joined the chat room'); 
		}else{
            //Broadcast to all clients
			io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, message:{}});
		}
	});
	
	//listening logout
	socket.on('disconnect', function(){

		//delete from users list
		if(onlineUsers.hasOwnProperty(socket.name)) {
			//user info
			var obj = {userid:socket.name, username:onlineUsers[socket.name]}; 
			delete onlineUsers[socket.name]; 
			onlineCount--;
			
			//message
	        let message = { 
	            section_type : 1,
	            content1 : obj.username +' logout the chat room',
	            content2 : '',
	            section_class : 'system'
	        } 

			//Broadcast to all clients
			io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, message:message});
			console.log(obj.username+' logout the chat room');
		}
	});
	
	//listening messages
	socket.on('message', function(obj){ 
		//Broadcast to all clients
		io.emit('message', obj);
		console.log(obj.username+' ：'+obj.content);
	});
  
});

http.listen(3001, function(){
	console.log('listening on *:3001');
});