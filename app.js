var express = require('express');
var app=express();
var mongoose=require('mongoose');

// connect to the database
mongoose.connect('mongodb://test:test@ds053186.mlab.com:53186/todolist-shubhamraj');
var todoSchema = new mongoose.Schema({
  id:String,
  list:[String]
});
var Todo = mongoose.model('Todo',todoSchema);
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
     id=data;var result;
    socket.join(id); // We are using room of socket io
      io.sockets.in(id).emit('got email',id);
      Todo.find({id:id},function(err,result){
          if(err)
          {
            console.log("some error occurred");
          }
          
      });
    });
    socket.on('send data',function(data){
      Itemdata[id].push(data);
      console.log(Itemdata);
      io.sockets.in(id).emit('new data',Itemdata[id]);
      });
      socket.on('delete',function(data){
        console.log(data);
        Itemdata[id].splice(Itemdata[id].indexOf(data),1);
        io.sockets.in(id).emit('deleted',Itemdata[id]);
        console.log(Itemdata[id]);
      });

  });
