var http=require('http');
var express=require('express');
var app=express();
var path=require('path')
var server=http.createServer(app);
var port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.render('home_style', {title: '안녕하세요'});
})

server.listen(port, function() {
    console.log("웹 서버 시작", port);
});