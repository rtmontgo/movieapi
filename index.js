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

app.use(morgan('common'));

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
app.get('/movies', function(req, res) {
  Movies.find()
  .then(function(movies) {
    res.status(200).json(movies)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Get info about a single movie by title
app.get('/movies/:Title', function(req, res) {
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
app.get('/genres/:Genre', function(req, res) {
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
app.get('/directors/:Director', function(req, res) {
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
app.get('/users', function(req, res) {
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

app.post('/users', function(req, res) {
  Users.findOne({ Username : req.body.Username })
  .then(function(user) {
    if (user) {
      return res.status(400).send(req.body.Username + "already exists");
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: req.body.Password,
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
app.delete('/users/:Username', function(req, res) {
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
app.put('/users/:Username', function(req, res) {
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
app.post('/users/:Username/movies/:MovieID', function(req, res) {
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
app.delete('/users/:Username/movies/:MovieID', function(req, res) {
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
app.listen(8080, () =>
console.log('Listening on port 8080.'));
