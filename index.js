const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const passport = require('passport');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
require('./passport');

mongoose.set('useFindAndModify', false);
//mongoose.connect('mongodb://localhost:27017/HoHdb', {useNewUrlParser: true});
mongoose.connect('mongodb+srv://rtmontgo:Zombie3%21@tmont-3jagp.mongodb.net/HoHdb?retryWrites=true&w=majority', { useNewUrlParser: true });

//Middleware functions
app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(cors());

var auth = require('./auth')(app);


app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something got slashed!');
});

//GET requests
app.get('/', function (req, res) {
  res.send('Welcome to your Home of Horror!')
});

//Get all movies
app.get('/movies'), function (req, res) {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
};

//Get info about a single movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), function (req, res) {
  Movies.findOne({ Title: req.params.Title })
    .then(function (movies) {
      res.json(movies)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Get data by genre
app.get('/genres/:Genre', passport.authenticate('jwt', { session: false }), function (req, res) {
  Movies.findOne({ "Genre.Name": req.params.Genre })
    .then(function (movies) {
      res.json(movies.Genre)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Get data about a specific director
app.get('/directors/:Director', passport.authenticate('jwt', { session: false }), function (req, res) {
  Movies.findOne({ "Director.Name": req.params.Director })
    .then(function (movies) {
      res.json(movies.Director)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.find()
    .then(function (users) {
      res.status(201).json(users)
    })
    .catch(function (err) {
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

app.post('/users',
  [check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()], (req, res) => {
    //check validation object for errors
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    var hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then(function (user) {
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
            .then(function (user) { res.status(201).json(user) })
            .catch(function (error) {
              console.error(error);
              res.status(500).send("Error: " + error);
            })
        }
      }).catch(function (error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  });

//Delete a user profille
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then(function (user) {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found.");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Update user profile
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
  [check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()],
  (req, res) => {

    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    var hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
      { new: true }, //Makes sure updated doc gets returned
      function (err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser)
        }
      })
  });

//Add a movie to the favorites list
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { Favorites: req.params.MovieID }
  },
    { new: true },
    function (err, updatedUser) {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser)
      }
    })
});

//Remove a movie from favorites list
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { Favorites: req.params.MovieID }
  },
    { new: true },
    function (err, updatedUser) {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser)
      }
    });
});


//listen for requests
var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function () {
  console.log("Listening on Port 3000");
});
