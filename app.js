var express = require("express"),
    app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/dogs", function(req, res){
    res.render("index");
});

app.listen(3000, function(){
    console.log("WildWoof app started!!!");
});
