var http=require("http");
var express=require("express");
var app=express();
var path=require('path')
var server=http.createServer(app);
var port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.get('/', function(req, res){
    res.render('home')
})

app.get('/login', function(req, res){
   res.render('login')
})

app.post('/login', function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    if (username == 'test' && password == '1234') {
        res.render('home', {username: username})
    } else{
        res.redirect('/login')
    }
})

server.listen(port, function() {
    console.log("웹 서버 시작", port);
}) 
