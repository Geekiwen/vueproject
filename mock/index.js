const express = require("express")
const app = express();
const bodyParser = require("body-parser");
var debug = require('debug')('my-application');

// post请求获取参数的方案
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    if(username === 'iwen' && password === '123'){
        res.send({
            code:200,
            msg:"登陆成功",
            username:"iwen",
            token:"W3ER33TRHE435TERTG45edE"
        })
    }else{
        res.send({
            code:500,
            msg:"登陆失败"
        })
    }
})

app.listen(3300,function(){
    console.log(3300);
})