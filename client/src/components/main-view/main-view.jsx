import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";

import { ProfileView } from '../profile-view/profile-view';
import { ProfileUpdate } from '../profile-view/profile-update';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import './main-view.scss';

export class MainView extends React.Component {
  constructor() {
    //Call the superclass constructor so React can initialize it
    super();

    //Initialize the state to an empty object so we can destructure it later
    this.state = {
      movies: [],
      selectedMovie: null,
      user: null,
      register: false,
      email: '',
      birthdate: '',
      userInfo: {}
    };
  }

  //One of the hooks available in a React Component
  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  getMovies(token) {
    axios.get('https://homeofhorror.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        //Assign the result to the state
        this.setState({
          movies: response.data
        });
        localStorage.setItem('movies', JSON.stringify(this.state.movies));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getUser(token) {
    axios
      .get('https://homeofhorror.herokuapp.com/users/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        this.props.setLoggedUser(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateUser(data) {
    this.setState({
      userInfo: data
    });
    localStorage.setItem('user', data.Username);
  }

  onButtonClick() {
    this.setState({
      selectedMovie: null
    });
  }

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({
      user: null
    })
    window.open('/', '_self');
  }

  //testing
  onSignedIn(user) {
    this.setState({
      user: user,
      register: false,
    });
  }
  //testing
  register() {
    this.setState({
      register: true
    });
  }

  //testing
  alreadyMember() {
    this.setState({
      register: false
    })
  }

  render() {
    //if the state isn't initialized, this will throw on runtime
    //before the data is initially loaded
    const { movies, selectedMovie, user, userInfo, login, register, token } = this.state;

    if (register) return <RegistrationView onClick={() => this.alreadyMember()} onSignedIn={user => this.onSignedIn(user)} />

    //before the movies has been loaded
    if (!movies) return <div className="main-view" />;
    return (
      <Router>
        <div className="navigation">
          <Link to={`/users/${localStorage.getItem('user')}`}>
            <Button className="profile" variant='outline-info'>Profile</Button>
          </Link>

          <Button className="logout" variant='outline-info' onClick={() => this.onLogout()} >Log Out</Button>
        </div >

        <div className="main-view">
          <Route exact path="/" render={() => {
            if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
            return movies.map(m => <MovieCard key={m._id} movie={m} />)
          }
          } />

          <Route path="/register" render={({ match }) => { return <RegistrationView register={register} /> }
          }
          />

          <Route path="/movies/:movieId" render={({ match }) => <MovieView movie={movies.find(m => m._id === match.params.movieId)} />} />

          <Route
            path='/directors/:name'
            render={({ match }) => {
              if (!movies) return <div className='main-view' />;
              return <DirectorView
                director={
                  movies.find(m => m.Director.Name === match.params.name).Director}
              />
            }}
          />
          <Route
            path='/genres/:name'
            render={({ match }) => {
              if (!movies || !movies.length) return <div className="main-view" />;
              return <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} />
            }
            }
          />

          <Route path="/users/:Username" render={({ match }) => { return <ProfileView userInfo={userInfo} /> }
          } />

          <Route path="/update/:Username" render={({ match }) => {
            return <ProfileUpdate userInfo={userInfo} user={user} token={token} updateUser={data => this.updateUser(data)}
            />
          }
          } />

        </div>
      </Router >
    );
  }
}