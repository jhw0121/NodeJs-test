var express=require("express");
var router=express.Router();

router.get('/', function (req, res, next){
    res.send('User')
}) //localhost:3333/user

router.get('/profile', function(req, res, next){
    res.send('User Profile!')
}) //localhost:3333/home/profile

module.exports=router;
