const express = require('express');
  morgan = require('morgan');
  bodyParser = require('body-parser');
  uuid = require('uuid');

const app = express();

app.use(morgan('common'));

let Users = [
  {
    id: 1,
    name: 'Sarah',
    email: 'user@hoh.com',
    password: '',
    username: 'sarah',
    favorites: []
  },
  {
    name: 'Joe James',
    email: 'myemail@email.com',
    password: '',
    username: 'myhorror',
    favorites: ['2', '5'],
    id: '01cad6c7-0d2f-475f-9db2-8945ed9e267b'
}
];

let Genres = [
  { name: 'Slasher', description: ''},
  { name: 'Supernatural', description: ''},
  { name: 'Demonic', description: ''},
  { name: 'Psychological', description: ''}
];

let Directors = [
  {name: 'Stanley Kubrick', bio: '', birthyear: '', deathyear: ''},
  {name: 'Ari Aster', bio: '', birthyear: '', deathyear: ''}
];

let Movies = [{
  id: '1',
  title: 'Get Out',
  director: 'Jordan Peele',
  genre: 'Psychological'
},
{
  id: '2',
  title: 'Rosemary\'s Baby',
  director: 'Roman Polansk',
  genre: 'Demonic'
},
{
  id: '3',
  title: 'Let the Right One In',
  director: 'Tomas Alfredson',
  genre: 'Supernatural'
},
{
  id: '4',
  title: 'Hereditary',
  director: 'Ari Aster',
  genre: 'Psychological'
},
{
  id: '5',
  title: 'Night of the Living Dead',
  director: 'George A. Romero',
  genre: 'Slasher'
},
{
  id: '6',
  title: 'The Witch',
  director: 'Robert Eggers',
  genre: 'Supernatural'
},
{
  id: '7',
  title: 'The Cabin in the Woods',
  director: 'Drew Goddard',
  genre: 'Slasher'
},
{
  id: '8',
  title: 'The Conjuring',
  director: 'James Wan',
  genre: 'Demonic'
},
{
  id: '9',
  title: 'The Exorcist',
  director: 'William Friedkin',
  genre: 'Demonic'
},
{
  id: '10',
  title: 'The Shining',
  director: 'Stanley Kubrick',
  genre: 'Supernatural'
}
];

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
  res.json(Movies)
});

//Get info about a single movie by title
app.get('/movies/:title', (req, res) => {
  res.json(Movies.find( (movie) => {
    return movie.title.toLowerCase().includes(req.params.title.toLowerCase()); }));
});

//Get data by genre
app.get('/genres/:genre', (req, res) => {
  res.json(Genres.find((genre) => {
    return genre.name === req.params.genre;
  }));
});

//Get data about a specific director
app.get('/directors/:name', (req, res) => {
  res.json(Directors.find((director) => {
    return director.name === req.params.name;
  }));
});

//Get all users
app.get('/users', (req, res) => {
  res.json(Users);
});

//Add new user
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    Users.push(newUser);
    res.status(201).send(newUser);
  }
});

//Delete a user profille
app.delete('/users/:id', (req, res) => {
  let user = Users.find((user) => {
    return user.id === req.params.id;
  });

  if (user) {
    Users = Users.filter(function(obj) {return obj.id !== req.params.id; });
    res.status(201).send('User ' + user.name + ' with ID ' + req.params.id + ' was removed.')
  }
});

//Update user profile
app.put('/users/:id', (req, res) => {
  let user = Users.find((user) => {
    return user.id === req.params.id;
  });
  let newUserInfo = req.body;

  if (user && newUserInfo) {
    newUserInfo.id = user.id;
    newUserInfo.favorites = user.favorites;
    Object.assign(user, newUserInfo);
    Users = Users.map((user) => (user.id === newUserInfo.id) ? newUserInfo : user);
    res.status(201).send(user);
  } else if (!newUserInfo.name) {
    const message = 'User entry is missing name';
    res.status(404).send(message);
  } else {
    res.status(404).send('User with id ' + req.params.id + ' was not found.');
  }
});

//Add a movie to the favorites list
app.post('/users/:id/:movieID', (req, res) => {
  let user = Users.find((user) => {
    return user.id === req.params.id;
  });
  let movie = Movies.find((movie) => {
    return movie.id === req.params.movieID;
  });
  if (user && movie) {
    user.favorites = [...new Set([...user.favorites, req.params.movieID])];
    res.status(201).send(user);
  } else if (!movie) {
    res.status(404).send('Movie with ID ' + req.params.movieID + ' was not found.');
  } else {
    res.status(404).send('User with ID ' + req.params.id + ' was not found.');
  }
});

//Remove a movie from favorites list
app.delete('/users/:id/:movieID', (req, res) => {
  let user = Users.find((user) => {
    return user.id === req.params.id;
  });
  let movie = Movies.find((movie) => {
    return movie.id === req.params.movieID;
  });
  if (user && movie) {
    user.favorites = user.favorites.filter((movieID) => {
      return movieID !== req.params.movieID;
    });
    res.status(201).send(user);
  } else if (!movie) {
    res.status(404).send('Movie with ID ' + req.params.movieID + ' was not found.');
  } else {
    res.status(404).send('User with ID ' + req.params.id + ' was not found.');
  }
});

app.use(function (err, req, res,  next) {
  console.error(err.stack);
  res.status(500).send('Something got slashed!');
});


//listen for requests
app.listen(8080, () =>
console.log('Listening on port 8080.'));
