const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var loggin = false;

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
const path = require('path')
app.use(express.static(__dirname + '/public'));
mongoose.connect("mongodb://localhost:27017/KarigarDB",{useNewUrlParser: true});

const AdminSchema = {
    user: String,
    pass: String
}

const Admin = mongoose.model("Admin", AdminSchema);

app.get("/admin",function(req,res){
    if(loggin == true) {
        res.redirect("/admin/dashboard");
    } else {
        res.sendFile(__dirname+"/login.html");
    }
})


app.post("/admin", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    // const admin = new Admin({
    //     user: username,
    //     pass:password
    // })
    // admin.save();
    // console.log("New admin saved to database: " + admin)
    // console.log(username);
    Admin.findOne({user:username},function(err,foundUser){
        if(!err){
            if(foundUser.user == username){
                if(foundUser.pass == password){
                    console.log("User logged in");
                    loggin = true;
                    res.redirect("/admin/dashboard");
                } else {
                    console.log("Invalid Password")
                    res.redirect("/admin");
                }
            }
        }
    })

})

app.post("/logout", function(req,res){
    loggin = false;
    res.redirect("/admin");
})


app.get("/admin/dashboard", function(req,res){
    if(loggin == false){
        res.redirect("/admin")
    } else {
        res.sendFile(__dirname+"/dashboard.html");
    }
})


app.listen(3000,function(){
    console.log("Server started on port 3000");
})