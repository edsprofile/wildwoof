var User = require("../models/user.js"),
    Dog = require("../models/dogs.js");

var middlewareObj = {}

middlewareObj.loginRequired = function(req, res, next){
    if(!req.user){
        return res.redirect("/login");
    }

    next();
}

module.exports = middlewareObj;
