var express = require('express');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('port',(process.env.PORT||3000));
Itemdata=[];var id;
app.get('/',function(req,res){
  res.sendFile(__dirname + '/todo.html');
});
http.listen (app.get('port'),function() {
  console.log("listening to port number "+app.get('port'));
});
io.sockets.on('connection', function (socket) {
  var users = [];
  socket.on('join', function (data) {
     id=data;
     users.push(id);
     users[id] = [];
     console.log(id);
    socket.join(id); // We are using room of socket io
      io.sockets.in(id).emit('got email',id);
    });
    socket.on('send data',function(data){
      socket.item=data;
      data = data.split(" ");
      person = data[0];
      data.splice(0,1);
      message = data.toString();
      console.log(message);
      console.log(person);
      users[person].push(message);
      console.log(users[person]);
      io.sockets.in(id).emit('new data',users[person]);
      });
      socket.on('delete',function(data){
        data = data.split(" ");
        person = data[0];
        data.splice(0,1);
        message = data.toString();
        Itemdata.splice(users[person].indexOf(message),1);
        io.sockets.in(id).emit('deleted',users[person]);
      });

  });
