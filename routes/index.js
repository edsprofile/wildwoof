var express = require("express"),
    passport = require("passport"),
    User = require("../models/user"),
    router = express.Router();

router.get("/", function(req, res){
    res.render("landing");
});

// CREATE  ROUTE - users
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, email: req.body.email});
    User.register(newUser, req.body.password, function(err, createdUser){
        if(err){
            console.log(err);
            console.log("ERROR in CREATE POST route!!!");
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/dogs");
        });
    });
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",{
    successRedirect: "/dogs",
    failureRedirect: "/login"
}),function(req,res){
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/dogs");
});

module.exports = router;
