const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
var loggin = false;
var orderN = 0;
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
const path = require('path')
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
mongoose.connect("mongodb://localhost:27017/KarigarDB",{useNewUrlParser: true});

const AdminSchema = {
    user: String,
    pass: String
}

const orderSchema = {
    OrderId:Number,
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
    res.render("index");
})


app.get("/admin",function(req,res){
    if(loggin == true) {
        res.redirect("/admin/dashboard");
    } else {
        res.render("login");
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
        OrderId:orderN,
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
    orderN++;
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
        res.render("dashboard")
    }
})

app.get("/orders",function(req,res){
    if(loggin==false){
        res.redirect("/admin")
    } else {
    let recOrders = [];
    Order.find({},function(err,orders){
        orders.forEach(function(order){
            const o1 = {
                Oid: order.OrderId,
                Oname: order.firstName + ' ' + order.lastName,
                Oemail: order.email,
                Onumber: order.PhoneNo,
                Oaddress: order.location,
                Ocity: order.city,
                Ostate: order.state,
                Ozip: order.zip,
                Omouse: order.mouse,
                Odesc: order.fault
            }
            console.log(o1);
            recOrders.push(o1);
        }) 
    res.render("orders",{Orders:recOrders});
    })
}
})

app.post("/orders",function(req,res){
    console.log("orders button was clicked");
    res.redirect("/orders");
})

app.post("/delete",function(req,res){
    const ids = req.body.orderIDs;
    Order.findOneAndDelete({OrderId:ids},function(err,order){
        if(err){
            console.log(err)
        } else {
            console.log("Successfuly delete order: " + order)
        }
    });
    res.redirect("/orders");
})

app.listen(3000,function(){
    console.log("Server started on port 3000");
})