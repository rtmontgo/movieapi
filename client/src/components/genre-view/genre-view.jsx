import React from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import './genre-view.scss';

import { MovieCard } from '../movie-card/movie-card';

export const GenreView = (props) => {
  const { movie, genre } = props;
  if (!genre) return null;

  function findGenreMovies(token) {
    axios.get('https://homeofhorror.herokuapp.com/genres/:Name', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (movie.Genre.Name === matchMedia.params.Name) return <MovieCard key={m._id} movie={m} />
    then(response => {
      //Assign the result to the state
      this.setState({
        movies: response.data
      });
    })
      .catch(function (error) {
        console.log(error);
      });
  }
  return (
    <div className="genre-view">
      <h1>{movie.Genre.Name}</h1>
      <div>
        <h3>Description</h3>
        <p>{movie.Genre.Description}
        </p>
      </div>
      <br />
      <h3 className="label">{props.genre} movies</h3>
      <ListGroup className="movies-by-genre">
        {props.movies.filter(movie => {
          if (movie.Genre.Name === genre.Name) {
            return (
              <ListGroup.Item key={movie._id}>
                {movie.Title}
                <Link to={`/movies/${movie._id}`}>
                  {" "}
                  <Button variant="primary" size="sm">
                    View
                      </Button>
                </Link>
              </ListGroup.Item>
            );
          } else {
            return null;
          }
        })}
      </ListGroup>
      <Link to={`/`} >
        <Button className="button-card" variant="info">Back</Button>
      </Link>
    </div>
  );
}


GenreView.propTypes = {
  genre: PropTypes.exact({
    Name: PropTypes.string,
    Description: PropTypes.string
  }),
  movie: PropTypes.arrayOf(
    PropTypes.shape({
      Title: PropTypes.string,
      ImageUrl: PropTypes.string,
      Description: PropTypes.string,
      Genre: PropTypes.exact({
        Name: PropTypes.string,
        Description: PropTypes.string
      }),
      Director: PropTypes.shape({
        Name: PropTypes.string,
        Bio: PropTypes.string
      })
    })
  )
};
