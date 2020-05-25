var express = require("express"),
    Dog = require("../models/dogs"),
    Comment = require("../models/comment"),
    router = express.Router({mergeParams: true});

// NEW ROUTE
router.get("/new", function(req, res){
    Dog.findById(req.params.id, function(err, foundDog){
        if(err){
            console.log("ERROR in COMMENT NEW route!!!");
        }
        else{
            res.render("comments/new", {dog: foundDog});
        }
    });
});

// CREATE ROUTE
router.post("/", function(req, res){
    Dog.findById(req.params.id, function(err, foundDog){
        if(err){
            console.log(err);
            console.log("ERROR in CREATE COMMENT route!");
            res.redirect("/dogs")
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    console.log("ERROR in CREATE COMMENT ELSE route!");
                }
                else{
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username;
                    comment.save();
                    foundDog.comments.push(comment);
                    foundDog.save()
                    console.log(comment);
                    res.redirect("/dogs/" + foundDog._id);
                }
            });
        }
    });
});

// EDIT ROUTE
router.get("/:commentId/edit", function(req, res){
    Comment.findById(req.params.commentId, function(err, foundComment){
        if(err){
            console.log(err);
            console.log("ERROR in EDIT COMMENT route!");
        }
        else{
            res.render("comments/edit", {dogId: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE ROUTE
router.put("/:commentId", function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, foundComment){
        if(err){
            console.log(err);
            console.log("ERROR in UPDATE COMMENT route!");
        }
        else{
            res.redirect("/dogs/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
router.delete("/:commentId", function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, deletedComment){
        if(err){
            console.log(err);
            console.log("ERROR in DESTROY ROUTE");
        }
        else{
            res.redirect("/dogs/" + req.params.id);
        }
    });
});

module.exports = router;
