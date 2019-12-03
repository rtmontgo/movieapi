import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './movie-view.scss';
import axios from 'axios';

export function MovieView(props) {

  const { movie } = props;
  if (!movie) return null;

  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post(`https://homeofhorror.herokuapp.com/users/${localStorage.getItem('user')}/movies/${movie._id}`, {
        Username: localStorage.getItem('user')
      },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      .then(response => {
        console.log(response);
        alert('Movie has been added to favorites');
      })
      .catch(event => {
        console.log('error adding to favorites');
        alert('Unable to add to favorites');
      });
  }

  return (
    <div>
      <Card>
        <Card.Img variant="top" src={movie.ImagePath} />
        <Card.Body>
          <Card.Title>{movie.Title || movie.Name}</Card.Title>
          <Card.Text>Description: {movie.Description || movie.Bio}</Card.Text>
          <Link to={`/genres/${movie.Genre.Name}`}><Button variant="link">{movie.Genre.Name}</Button></Link>
          <Card.Text>Genre: {movie.Genre.Name}</Card.Text>
          <Card.Text>
            Description: {movie.Genre.Description}</Card.Text>
          <Card.Text>Director:
          <Link to={`/directors/${movie.Director.Name}`}><Button variant="link">{movie.Director.Name}</Button></Link>
          </Card.Text>
          <Card.Text>Bio: {movie.Director.Bio}</Card.Text>
        </Card.Body>
        <Button block variant="outline-primary" onClick={event => handleSubmit(event)}>Add to Favorites</Button>
        <Link to={`/`}><Button block variant="primary">Go Back</Button>
        </Link>
      </Card>
    </div>
  );
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string,
    Name: PropTypes.string,
    ImageUrl: PropTypes.string,
    Description: PropTypes.string,
    Genre: PropTypes.shape({
      Name: PropTypes.string,
      Description: PropTypes.string
    }),
    Director: PropTypes.shape({
      Name: PropTypes.string,
      Bio: PropTypes.string
    })
  })
};
