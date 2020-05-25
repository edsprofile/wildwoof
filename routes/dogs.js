var express = require("express"),
    Dog     = require("../models/dogs"),
    Comment = require("../models/comment"),
    middleware = require("../middleware/"),
    router  = express.Router();

//  INDEX ROUTE
router.get("/", function(req, res){
    Dog.find({}, function(err, dogs){
        if(err){
            console.log(err);
            console.log("There was an error in the SHOW route!!!");
        }
        else{
            res.render("dogs/index", {dogs: dogs});
        }
    });
});

// NEW ROUTE
router.get("/new", middleware.loginRequired, function(req, res){
    res.render("dogs/new");
});

// CREATE ROUTE
router.post("/", middleware.loginRequired,function(req, res){
    var name = req.body.dog.name;
    var image = req.body.dog.image;
    var desc = req.body.dog.description;
    var price = req.body.dog.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newDog = {name: name, image: image, description: desc, price: price, author: author};
    Dog.create(newDog, function(err, createdDog){
        if(err){
            console.log(err)
            console.log("Error in CREATE route.");
        }
        else{
            res.redirect("/dogs");
        }
    });
});

// SHOW ROUTE
router.get("/:id", middleware.loginRequired, function(req, res){
    Dog.findById(req.params.id).populate("comments likes").exec(function(err, foundDog){
        if(err){
            console.log(err);
            console.log("ERROR in SHOW route!!!");
        }
        else{
            res.render("dogs/show", {dog: foundDog});
        }
    });
});

// EDIT ROUTE
router.get("/:id/edit", function(req, res){
    Dog.findById(req.params.id, function(err, foundDog){
        if(err){
            console.log(err);
            console.log("ERROR in EDIT route!!!");
        }
        else{
            res.render("dogs/edit", {dog: foundDog});
        }
    });
});

// UPDATE ROUTE
router.put("/:id", function(req, res){
    Dog.findByIdAndUpdate(req.params.id, req.body.dog, function(err, updatedDog){
        if(err){
            console.log(err);
            console.log("ERROR in EDIT route!!!");
        }
        else{
            res.redirect("/dogs/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
router.delete("/:id", function(req, res){
    Dog.findByIdAndRemove(req.params.id, function(err, removedDog){
        if(err){
            console.log(err);
            console.log("ERROR in DESTROY route!!!");
        }
        else{
            res.redirect("/dogs");
        }
    })
});

// LIKE ROUTE
router.post("/:id/like", middleware.loginRequired, function(req, res){
    Dog.findById(req.params.id, function(err, foundDog){
        if(err){
            console.log(err);
            return res.redirect("/dogs");
        }

        // check if user already exists in likes
        var foundUserLike = foundDog.likes.some(function(like){
            return like.equals(req.user._id);
        });

        if(foundUserLike){
            foundDog.likes.pull(req.user._id);
        }
        else{
            foundDog.likes.push(req.user);
        }

        foundDog.save(function(err){
            if(err){
                console.log(err);
                return res.redirect("/dogs");
            }
            return res.redirect("/dogs/" + foundDog._id);
        });
    });
});

module.exports = router;
