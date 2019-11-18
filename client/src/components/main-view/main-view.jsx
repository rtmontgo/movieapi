import React from 'react';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';



import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import './main-view.scss';

export class MainView extends React.Component {
  constructor(props) {
    //Call the superclass constructor so React can initialize it
    super(props);

    //Initialize the state to an empty object so we can destructure it later
    this.state = {
      movies: null,
      selectedMovie: null,
      user: null,
      register: false
    };
  }

  //One of the hooks available in a React Component 
  componentDidMount() {
    axios.get('https://homeofhorror.herokuapp.com/movies')
      .then(response => {
        console.log(response);
        //Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
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
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onButtonClick() {
    this.setState({
      selectedMovie: null
    });
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
    const { movies, selectedMovie, user, register } = this.state;

    if (!user && register === false) return <LoginView onClick={() => this.register()} onLoggedIn={user => this.onLoggedIn(user)} />

    if (register) return <RegistrationView onClick={() => this.alreadyMember()} onSignedIn={user => this.onSignedIn(user)} />

    //before the movies has been loaded
    if (!movies) return <div className="main-view" />;
    return (
      <div className="main-view">
        <Container>
          <Row>
            {selectedMovie
              ? <MovieView movie={selectedMovie} onClick={() => this.onButtonClick()} />
              : movies.map(movie => (

                <Col key={movie._id} xs={12} sm={6} md={4}>
                  <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
                </Col>
              ))
            }
          </Row>
        </Container>
      </div>
    );
  }
}