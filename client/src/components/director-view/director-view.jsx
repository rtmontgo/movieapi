import React from 'react';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Media from 'react-bootstrap/Media';
import './director-view.scss';

export const DirectorView = (props) => {
  const { director, movies, user, userProfile, onToggleFavourite } = props;
  if (!director) return null;
  return (
    <div className="director-view">
      <h1>{director.Name}</h1>
      { // render the birth year (4 chars) if present
        director.Birthyear && <h6 className="text-muted">Born in {director.Birthyear.substring(0, 4)}</h6>}
      <br />
      <Media className="d-flex flex-column flex-md-row align-items-center">
        <Media.Body>
          <h5>Bio</h5>
          <p>{director.Bio}</p>
          <br />
          Death Year: {Director.DeathYear}
        </Media.Body>
      </Media>
      <div className="return">
        <Link to={`/`}>
          <Button className="return-btn" variant="info">Return</Button>
        </Link>
      </div>
    </div>
  );
} 
