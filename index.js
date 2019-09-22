const express = require('express');
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topMovies = [{
  Title: 'Get Out',
  Director: 'Jordan Peele'
},
{
  Title: 'Rosemary\'s Baby',
  Director: 'Roman Polansk'
},
{
  Title: 'Let the Right One In',
  Director: 'Tomas Alfredson'
},
{
  Title: 'Hereditary',
  Director: 'Ari Aster'
},
{
  Title: 'Night of the Living Dead',
  Director: 'George A. Romero'
},
{
  Title: 'The Witch',
  Director: 'Robert Eggers'
},
{
  Title: 'The Cabin in the Woods',
  Director: 'Drew Goddard'
},
{
  Title: 'The Conjuring',
  Director: 'James Wan'
},
{
  Title: 'The Exorcist',
  Director: 'William Friedkin'
},
{
  Title: 'The Shining',
  Director: 'Stanley Kubrick'
}
];

var myLogger = function(req, res, next) {
  console.log(req.url);
  next();
};

//GET requests
app.use(myLogger);
app.use(express.static('public'));
app.get('/', function(req, res) {
  res.send('Welcome to your Home of Horror!')
});
app.get('/movies', function(req, res) {
  res.json(topMovies)
});
app.use(function (err, req, res,  next) {
  console.error(err.stack);
  res.status(500).send('Something got slashed!');
});


//listen for requests
app.listen(8080, () =>
console.log('Listening on port 8080.'));
