const express = require('express');
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topMovies = [{
  Title: Snatch,
  Director: Guy Ritchie
}]

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
