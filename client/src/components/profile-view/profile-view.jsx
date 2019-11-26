import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import './profile-view.scss';
import { Link } from "react-router-dom";

import { ProfileUpdate } from '../profile-view/profile-update';

export class ProfileView extends React.Component {

  constructor() {
    super();
    this.state = {
      username: null,
      password: null,
      email: null,
      birthdate: null,
      userData: null,
      favoriteMovies: []
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.getUser(accessToken);
    }
  }

  getUser(token) {
    let username = localStorage.getItem('user');
    axios.get(`https://homeofhorror.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          userData: response.data,
          username: response.data.Username,
          password: response.data.Password,
          email: response.data.Email,
          birthdate: response.data.Birthdate,
          favoriteMovies: response.data.Favorites
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  updateUser(event, userInfo) {
    event.preventDefault();
    console.log(userInfo);
  }

  deleteFavoriteMovie(event, favoriteMovie) {
    event.preventDefault();
    console.log(favoriteMovie);
    axios.delete(`https://homeofhorror.herokuapp.com/users/${localStorage.getItem('user')}/Favorites/${favoriteMovie}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        this.getUser(localStorage.getItem('token'));
      })
      .catch(event => {
        alert('Something went wrong');
      });
  }

  render() {
    const { username, email, birthdate, favoriteMovies } = this.state;

    return (
      <Card className="profile-view" style={{ width: '30rem' }}>
        <Card.Body>
          <Card.Title className="profile-name">My Profile</Card.Title>
          <Link to={`/update/${username}`}><Button className="edit-btn" size="sm" variant="info">Edit</Button>
          </Link>
          <ListGroup className="list-group" variant="flush">
            <ListGroup.Item>Username: {localStorage.getItem('username')}</ListGroup.Item>
            <ListGroup.Item>Password: *****</ListGroup.Item>
            <ListGroup.Item>Email: {localStorage.getItem('email')}</ListGroup.Item>
            <ListGroup.Item>Birthdate: {localStorage.getItem('birthdate')}</ListGroup.Item>
            <ListGroup.Item>Favorite Movies:
              <div>
                {favoriteMovies.length === 0 &&
                  <div className="nil">No Favorites Yet</div>
                }
                {favoriteMovies.length > 0 &&
                  <ul>
                    {favoriteMovies.map(favoriteMovie => (<li key={favoriteMovie}>
                      <p className="favs">
                        {JSON.parse(localStorage.getItem('movies')).find(movie => movie._id === favoriteMovie).Title}
                      </p>
                      <Link to={`/movies/${favoriteMovie}`}>
                        <Button size="sm" variant="info">Open</Button>
                      </Link>
                      <Button variant="secondary" size="sm" onClick={(event) => this.deleteFavoriteMovie(event, favoriteMovie)}>Delete</Button>
                    </li>)
                    )}
                  </ul>
                }
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    );
  }
}