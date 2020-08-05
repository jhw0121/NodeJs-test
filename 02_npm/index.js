var http=require("http");
var express=require("express");
var path=require('path');
var app=express();
var server=http.createServer(app);
var port = 3333;

server.listen(port, function() {
    console.log("웹 서버 시작", port);
}) 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', function(req, res){
    res.send('Hello world');
})

app.get('/page2', function(req, res){
    res.send('Page2');
})

app.get('/pug', function(req, res){
    res.render('index', {title: 'Pug'});
}) // http://localhost:3333/pug

app.get('/pug/:title/:id', function(req, res){
    console.log('params ->', req.params)
    console.log('title->', req.params.title);
    res.render('index', {
        title: params.title,
        id: req.params.id});
}) //http://localhost:3333/pug/hyewon // :title로 받아온 text=req.params.title

app.get('/home', function(req, res){
    res.render('home', {pug_title: 'Home!!!!'})
}) //http://localhost:3333/home

