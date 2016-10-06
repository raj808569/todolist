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
  socket.on('join', function (data) {
     id=data;
    socket.join(id); // We are using room of socket io
      io.sockets.in(id).emit('got email',id);
    });
    socket.on('send data',function(data){
      socket.item=data;
      Itemdata.push(data);
      console.log(Itemdata);
      io.sockets.in(id).emit('new data',Itemdata);
      });
      socket.on('delete',function(data){
        Itemdata.splice(Itemdata.indexOf(data),1);
        io.sockets.in(id).emit('deleted',Itemdata);
      });

  });
