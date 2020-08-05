var http=require('http');
var express=require('express');
var app=express();
var path=require('path')
var server=http.createServer(app);
var port = 3333;
var session = require('express-session');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(
    session({
        secret: 'sdfjkl*aasjhasdfweasdfhwekjjrwe,werawef#$$%^$W$',
        resave: false,
        saveUninitialized: true
    })
)

var mysql=require('mysql2');
const connection=mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'jhw121',
    database: 'test'
})

app.get('/', function(req, res){
    res.render('home', {email: req.session.email});
});

app.get('/board', function(req, res){
    res.render('board', {email: req.session.email});
})

app.get('/login', function(req, res){
    res.render('login', {error: false, email: req.session.email});
});

app.get('/signup', function(req, res){
    res.render('signup', {errorMessage: null, email: req.session.email});
});

app.get('/logout', function(req, res){
    if (req.session.email){
        req.session.destroy(function(err) {
            if (err) {
                console.log(err);
            } else{
                res.redirect('/');
            }
        })
    }   else {
        res.redirect('/');
    }
})

app.post('/signup', function(req, res){
    const email = req.body.email;
    const password = req.body.password;
    var age = null;
    if (req.body.age) {
        age = req.body.age
    } 
    connection.query(
        `SELECT id from users WHERE email=?`, //email이 같은 user의 id 찾기
        [email],
        function(err, users){ //오류발생
            if (err) {
                res.render('signup', {errorMessage: "오류발생", email: req.session.email}); //서버상의 오류가 발생할 때 나타남 
            } else if (users.length > 0) {                      //ex)서버에 접근할 수 없거나 테이블이 없을 경우
                res.render('signup', {errorMessage: "이미 존재하는 이메일", email: req.session.email}); //아이디가 중복될 경우
            } else { //이메일이 users table에 없을 경우
                connection.query(
                    `INSERT INTO users (email, password, age)
                            VALUES (?, ?, ?)`,
                    [email, password, age],
                    function(err2, result){
                        if (err2) {
                            res.render('signup', {errorMessage: "생성오류", email: req.session.email}); //서버상의 오류가 발생할 때 나타남
                        } else {  //insert 성공
                            res.render('login', {error: false, email: req.session.email})
                        }
                    }
                )
            }   
        }
    )
    
})

app.post('/login', function(req, res){
    const email = req.body.email;
    const password = req.body.password;
    connection.query(
        "SELECT * from users WHERE email=? and password=?",
        [email, password],
        function(err, users){
            if(err){
                console.log(err);
            } else if (users.length > 0) {
                req.session.email = email;
                res.redirect('/');
            } else {
                res.render('login', {error:true, email: req.session.email});
            }
        }

    )
})

app.get('/list', function(req, res) {
    connection.query('SELECT * from users', function(err, rows) {
        if ( err ) {
            console.log(err);
        }
        console.log('users', users)
        res.render('list', { user: users, email: req.session.email });
    })
});
 
app.get('/info', function(req, res) {
    connection.query('SELECT * from persons', function(error, persons) {
        if ( error ) {
            console.log(error);
        }
        console.log('persons', persons);
        res.render('info', { person: persons, email: req.session.email });
    })
});
 

server.listen(port, function() {
    console.log("웹 서버 시작", port);
});