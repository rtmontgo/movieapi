import React from 'react';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import './genre-view.scss';

import { Link } from "react-router-dom";
import { MovieView } from '../movie-view/movie-view';

export const GenreView = (props) => {
  const { genre, movies, user, userProfile, onToggleFavourite } = props;
  if (!genre) return null;

  return (
    <Container className="genre-info">
      <h1>{genre.Name}</h1>
      <div>
        Description: <br />
        {genre.Description}
        <br />
        <br />
      </div>
      <Link to={`/`} >
        <Button className="button-card" variant="info">Back</Button>
      </Link>
    </Container>
  );
}

