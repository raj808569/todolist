var express = require('express');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('port',(process.env.PORT||3000));
Itemdata={};var id;
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
    Itemdata[id]=[];
      io.sockets.in(id).emit('got email',id);
    });
    socket.on('send data',function(data){
      Itemdata[id].push(data);
      console.log(Itemdata);
      io.sockets.in(id).emit('new data',Itemdata[id]);
      });
      socket.on('delete',function(data){
        data=data.split(" ");
        console.log(data);
        data.splice(0,1);
        newdata=data.toString();
        Itemdata[id].splice(Itemdata[id].indexOf(newdata),1);
        io.sockets.in(id).emit('deleted',Itemdata[id]);
        console.log(Itemdata[id]);
      });

  });
