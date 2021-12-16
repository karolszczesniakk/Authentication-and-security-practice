require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

const User = new mongoose.model("User",userSchema);

app.route("/register")

.get(function(req,res){
    res.render("register");
})

.post(function(req,res){
    bcrypt.hash(req.body.password, saltRounds, function(err,hash){
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if(err){
                console.log(err);       
            } else {
                console.log("Registered new user");
                res.render("secrets"); 
            }
        });     
    })  
});

app.route("/login")

.get(function(req,res){
    res.render("login");
})

.post(function(req,res){
    const userName = req.body.username;
    const password = req.body.password;


    User.findOne({email: userName},function(err,foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(error,result){
                    if(result === true){
                        res.render("secrets");   
                    }
                }); 
            } else {
                console.log("Didnt find user")
                res.redirect("/login");
            }
            
        } 
    })
});

app.get("/",function(req,res){
    res.render("home");
});

app.listen(3000, function(){
    console.log("Server started on port 3000.");
});
