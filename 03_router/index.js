var http=require("http");
var express=require("express");
var app=express();
var server=http.createServer(app);
var port = 3333;

var homeRouter=require('./routes/home');
var userRouter=require('./routes/user');

app.use('/home', homeRouter)
app.use('/user', userRouter)

server.listen(port, function() {
    console.log("웹 서버 시작", port);
}) 


