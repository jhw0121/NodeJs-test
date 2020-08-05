var express=require("express");
var router=express.Router();

router.get('/', function (req, res, next){
    res.send('HOME!')
}) //localhost:3333/home

router.get('/inside', function(req, res, next){
    res.send('HOME INSIDE!')
}) //localhost:3333/home/inside

module.exports=router;
