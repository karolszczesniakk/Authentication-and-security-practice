require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');
const ejs = require("ejs");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User",userSchema);


app.route("/register")

.get(function(req,res){
    res.render("register");
})

.post(function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
    
});

app.route("/login")

.get(function(req,res){
    res.render("login");
})

.post(function(req,res){
    User.findOne({email: req.body.username},function(err,foundUser){
        if(!err){
            if(foundUser && foundUser.password === req.body.password){
                res.render("secrets");   
            } else {
                console.log("Didnt find user")
                res.redirect("/login");
            }
        } else {
            console.log(err);
        } 
    })
})

app.get("/",function(req,res){
    res.render("home");
});

app.listen(3000, function(){
    console.log("Server started on port 3000.");
});
