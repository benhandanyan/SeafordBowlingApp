var url = require('url');
var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var bodyParser = require("body-parser");
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ejwt = require('express-jwt');

//create server
var router = express();
var server = http.createServer(router);
var auth = ejwt({secret: 'SECRET', userProperty: 'payload'});

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
router.use(passport.initialize());

router.use(express.static(path.resolve(__dirname, 'public')));

//this is where we actually turn to the outside world.  You'll need 
//to adjust if you are on some other server
server.listen(17049, "0.0.0.0", function() {
    var addr = server.address();
    console.log("listening to server");
});

//require mongoose
var mongoose = require('mongoose');

//connect to the database
mongoose.connect("mongodb://localhost:29792/bowlingrecords", function(err, db) {
    if (!err) {
        console.log("We are connected to the database");
    } else {
        console.log("*** There was an error connecting to the database ***");
    }
});


//set up table to store ball information
var infoSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    DateCreated: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    City: {
        type: String,
        required: true
    },
    State: {
        type: String,
        required: true
    },
    Zip: {
        type: String,
        required: true
    },
    Phone: {
        type: String,
        required: true
    },
    Cell: {
        type: String
    },
    Email: {
        type: String,
        required: true
    },
    Hand: {
        type: String,
        required: true
    },
    Conv: {
        type: String,
        required: true
    },
    FT: {
        type: String,
        required: true
    },
    Ball: {
        type: String,
        required: true
    },
    Weight: {
        type: String,
        required: true
    },
    Pin: {
        type: String,
        required: true
    },
    Layout: {
        type: String,
        required: true
    },
    Surface: {
        type: String,
        required: true
    },
    BHPosition: {
        type: String,
        required: true
    },
    Size: {
        type: String,
        required: true
    },
    Depth: {
        type: String,
        required: true
    },
    Paph: {
        type: String,
        required: true
    },
    // Papv: {
        // type: String,
        // required: true
    // },
    Papud: {
        type: String,
        required: true
    },
    Papclt: {
        type: String,
        required: true
    },
    Thumb: {
        type: String,
        required: true
    },
    Fingers: {
        type: String,
        required: true
    },
    Price: {
        type: String,
        required: true
    },
    CompletedBy: {
        type: String,
        required: true
    },
    Notes: {
        type: String,
        required: true
    },
    A1: {
        type: String,
        required: true
    },
    A2: {
        type: String,
        required: true
    },
    A3: {
        type: String,
        required: true
    },
    A4: {
        type: String,
        required: true
    },
    A5: {
        type: String,
        required: true
    },
    A6: {
        type: String,
        required: true
    },
    CTC1: {
        type: Boolean,
    },
    FS1: {
        type: Boolean,
    },
    CTC2: {
        type: Boolean,
    },
    FS2: {
        type: Boolean,
    },
    F1: {
        type: String,
        required: true
    },
    F2: {
        type: String,
        required: true
    },
    F3: {
        type: String,
        required: true
    },
    F4: {
        type: String,
        required: true
    },
    F5: {
        type: String,
        required: true
    },
    F6: {
        type: String,
        required: true
    },
    F7: {
        type: String,
        required: true
    },
    F8: {
        type: String,
        required: true
    },
    F9: {
        type: String,
        required: true
    },
    D1: {
        type: String,
        required: true
    },
    D2: {
        type: String,
        required: true
    },
    FT1: {
        type: String,
        required: true
    },
    FT2: {
        type: String,
        required: true
    },
    FT3: {
        type: String,
        required: true
    }

})

var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true},
  hash: String,
  salt: String
});
console.log("user schema created");

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {

  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};


mongoose.model('User', UserSchema);

mongoose.model('infoModel', infoSchema);

var info = mongoose.model("infoModel");
var User = mongoose.model('User');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      return done(null, user);
    });
  }
));

function displayAllRecords(){
info.find(function(err, records){
  if(err){
    console.log("*** error querying records! ***");
  }
})
}

//API

router.post('/info', function(req, res, next) { 
    var newInfo = new info(req.body);
    newInfo.save(function(err, newInfo) {
        if (err) {
            console.log(err);
            return next(err);
        } else {
            console.log("new personalInfo successfully saved!")
             displayAllRecords();

        }
        res.json(newInfo);
    });
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.get("/info", function(req, res, next){
	info.find(function(err, records){
		if (err) { return next(err); }
		res.json(records);
	});
});

router.get('/info/:ball', function(req, res, next) {
	var url_parts = url.parse(req.url, true);
	var str = url_parts.path;
	var ObjectId = require('mongoose').Types.ObjectId; 
	var id = str.substring(6);
  info.find({"_id":id}, function(err, post) {
    if (err) { return next(err); }
    res.json(post);
  });
});

