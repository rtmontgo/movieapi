import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import './movie-view.scss';

export class MovieView extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { movie, back, onClick } = this.props;

    if (!movie) return null;

    return (
      <div>
        <Card style={{ width: '80%' }}>
          <Card.Img variant="top" src={movie.ImagePath} />
          <Card.Body>
            <Card.Title>{movie.Title || movie.Name}</Card.Title>
            <Card.Text>Description: {movie.Description || movie.Bio}</Card.Text>
            <Card.Text>Genre: {movie.Genre.Name}</Card.Text>
            <Card.Text>Description: {movie.Genre.Description}</Card.Text>
            <Card.Text>Director: {movie.Director.Name}</Card.Text>
            <Card.Text>Bio: {movie.Director.Bio}</Card.Text>
            <Button variant="primary" onClick={() => onClick()} className="go-back">Go Back</Button>
          </Card.Body>
        </Card>
      </div>
    );
  }
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
  }).isRequired
};
