"use strict";

var app = require('express')();
var fs = require('fs');
var http = require('http').Server(app);

app.get('/update.xml', function(request, response){
  var filename = 'update.xml';
  fs.readFile(filename, function(err, content) {
      if (err) {
        response.writeHead(404, {'Content-type' : 'text/xml; charset=UTF-8'});
        response.write(err.message);
      } else {
        response.writeHead(200, {'Content-type' : 'text/xml; charset=UTF-8'});
        response.write(content);
      }
      response.end();
    });
});
/**
app.get('/chat.crx', function(request, response){
  var filename = 'chat.crx';
  fs.readFile(filename, function(err, content) {
      if (err) {
        response.writeHead(404, {'Content-type' : 'text/plain; charset=UTF-8'});
        response.write(err.message);
      } else {
        response.writeHead(200, {'Content-type' : 'text/plain; charset=UTF-8'});
        response.write(content);
      }
      response.end();
    });
});
**/

http.listen(3002, function(){
	console.log('listening on *:3002');
});