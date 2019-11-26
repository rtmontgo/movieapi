import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import './movie-card.scss';
import { Link } from 'react-router-dom';

export class MovieCard extends React.Component {
  render() {
    //This is given to the <MovieCard /> component by the outer world which, in this case, is  `MainView`, as `MainView` is what's connected to your database via the movies endpoint of your API
    const { movie } = this.props;

    return (
      <Col className="movie-display">
        <Card style={{ width: '16rem' }}>
          <Card.Img variant="top" src={movie.ImagePath} />
          <Card.Body>
            <Card.Title>{movie.Title || movie.Name}</Card.Title>
            <Card.Text>{movie.Description || movie.Bio}</Card.Text>
            <Link to={`/movies/${movie._id}`}>
              <Button variant="link">Open</Button>
            </Link>
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string,
    Name: PropTypes.string,
    Description: PropTypes.string,
    ImagePath: PropTypes.string.isRequired
  }).isRequired,
};