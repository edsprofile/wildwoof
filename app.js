require("dotenv").config();
var express = require("express"),
    csurf = require("csurf"),
    helmet = require("helmet"),
    passport = require("passport"),
    mongoose = require("mongoose"),
    User = require("./models/user"),
    bodyParser = require("body-parser"),
    dogRoutes = require("./routes/dogs"),
    sessions = require("client-sessions"),
    indexRoutes = require("./routes/index"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    commentRoutes = require("./routes/comments"),
    app = express();

var url = process.env.DATABASE || "mongodb://localhost/wildwoof";
mongoose.connect(url, {useNewUrlParser: true,
                       useUnifiedTopology: true,
                       useCreateIndex: true
                      });

// APP CONFIG
app.set("view engine", "ejs");
app.use(helmet());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


// PASSPORT CONFIG
app.use(sessions({
    cookieName: "session",
    secret: process.env.SUPERSECRET,
    duration: 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE to run at every call to check for authentication
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// ROUTES
app.use("/", indexRoutes)
app.use("/dogs", dogRoutes);
app.use("/dogs/:id/comments", commentRoutes);

var port = process.env.PORT;
if(!process.env.PORT){
    port = 3000;
}
app.listen(port, function(){
    console.log("WildWoof app started!!!");
});
