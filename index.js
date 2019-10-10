const express = require('express');
  morgan = require('morgan');
  bodyParser = require('body-parser');
  uuid = require('uuid');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/HoHdb', {useNewUrlParser: true});

const app = express();

const cors = require('cors');
app.use(cors());

const { check, validationResult } = require('express-validator');

var allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ //If a specific origin isn't found on the list of allowed origins
      var message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

app.use(morgan('common'));

var auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

var myLogger = function(req, res, next) {
  console.log(req.url);
  next();
};

//GET requests
app.use(myLogger);
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Welcome to your Home of Horror!')
});

//Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), function(req, res) {
  Movies.find()
  .then(function(movies) {
    res.status(201).json(movies)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Get info about a single movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), function(req, res) {
  Movies.findOne({ Title : req.params.Title })
  .then(function(movies) {
    res.json(movies)
  })
  .catch(function(err) {
  console.error(err);
  res.status(500).send("Error: " + err);
});
});

//Get data by genre
app.get('/genres/:Genre', passport.authenticate('jwt', { session: false }), function(req, res) {
  Movies.findOne({ "Genre.Name" : req.params.Genre })
  .then(function(movies) {
    res.json(movies.Genre)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Get data about a specific director
app.get('/directors/:Director', passport.authenticate('jwt', { session: false}), function(req, res) {
  Movies.findOne({ "Director.Name" : req.params.Director})
  .then(function(movies) {
    res.json(movies.Director)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.find()
  .then(function(users) {
    res.status(201).json(users)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Add new user
// //We'll expect in this format
// {
//   ID : Integer,
//   Username : String,
//   Password : String,
//   Email : String,
//   Birthday : Date
// }

app.post('/users', [check('Username', 'Username is required'.isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()], function(req, res) {
    //check validation object for errors
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json(422).json({ errors: errors.array()
      });
    }

  var hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username : req.body.Username })
  .then(function(user) {
    if (user) {
      return res.status(400).send(req.body.Username + "already exists");
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then(function(user) {res.status(201).json(user) })
      .catch(function(error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      })
    }
  }).catch(function(error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  });
});

//Delete a user profille
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOneAndRemove({ Username : req.params.Username })
  .then(function(user) {
    if (!user) {
      res.status(400).send(req.params.Username + " was not found.");
    } else {
      res.status(200).send(req.params.Username + " was deleted.");
    }
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Update user profile
app.put('/users/:Username', [check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()], passport.authenticate('jwt', { session: false }), function(req, res) {

    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array()
      });
    }

  Users.findOneAndUpdate({ Username : req.params.Username }, {
    $set :
    {
      Username : req.body.Username,
      Password : req.body.Password,
      Email : req.body.Email,
      Birthday : req.body.Birthday
    }},
    { new : true }, //Makes sure updated doc gets returned
    function(err, updatedUser) {
      if(err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser)
      }
    })
});

//Add a movie to the favorites list
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username }, { $push : { Favorites : req.params.MovieID }
  },
{ new : true },
function(err, updatedUser) {
  if (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  } else {
    res.json(updatedUser)
  }
})
});

//Remove a movie from favorites list
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), function(req, res) {
  Users.findOneAndUpdate ({Username: req.params.Username}, {$pull : {Favorites : req.params.MovieID}
  },
  { new : true },
function(err, updatedUser) {
  if (err){
    console.error(err);
    res.status(500).send("Error: " + err);
  } else {
    res.json(updatedUser)
  }
});
});

app.use(function (err, req, res,  next) {
  console.error(err.stack);
  res.status(500).send('Something got slashed!');
});


//listen for requests
var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
  console.log("Listening on Port 3000");
});
