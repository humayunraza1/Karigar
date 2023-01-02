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

const orderSchema = {
    firstName:String,
    lastName:String,
    email: String,
    PhoneNo:Number,
    location:String,
    city:String,
    state:String,
    zip:Number,
    mouse:String,
    fault:String
}

const Order = mongoose.model("Order",orderSchema);

const Admin = mongoose.model("Admin", AdminSchema);

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html")
})


app.get("/admin",function(req,res){
    if(loggin == true) {
        res.redirect("/admin/dashboard");
    } else {
        res.sendFile(__dirname+"/login.html");
    }
})

app.post("/", function(req,res){
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const number = req.body.number;
    const address = req.body.address;
    const city = req.body.city;
    let stateN = req.body.State;
    const postalCode = req.body.zipCode;
    const mouseMod = req.body.mouse;
    const fault = req.body.description;
    var state = "";
    console.log(stateN);
    switch(stateN){
        case "1":
            state = "Sindh"
            break;
        case "2":
            state = "Punjab"
            break;
        case "3":
            state = "Khyber Pakhtunkhwa"
            break;
        case "4":
            state = "Azad Jammu & Kashmir"
            break;
        case "5":
            state = "Balochistan"
            break;    
        default: state = "No state found";
        }
    const order = new Order({
        firstName: fname,
        lastName: lname,
        email:email,
        PhoneNo:number,
        location:address,
        city:city,
        state:state,
        zip:postalCode,
        mouse:mouseMod,
        fault:fault
    })
    order.save();
    console.log(order);

    // order.save();

    res.redirect("/");

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