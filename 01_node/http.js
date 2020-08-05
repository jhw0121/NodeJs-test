var http = require("http"); // common js
var server = http.createServer();
var port = 3333;

server.listen(port, function() {
    console.log("웹 서버 시작", port)
}) 

server.on("connection", function(socket){
    console.log('클라이언트 접속!');
    console.log(socket.address().address);
    console.log(socket.address().port);
})

server.on('request', function(req, res){
    console.log('클라이언트 요청!');
    res.write('<h1>Hello world</h1>');
    res.write('<h2>Hello world</h2>');
    res.end();
    })

