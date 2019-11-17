import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import PropTypes from 'prop-types';
import './login-view.scss';
import '../registration-view/registration-view';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
    //Send request to server for auth
    //then call props.onLoggedIn(username)
    props.onLoggedIn(username);
  };

  return (
    <Container className='login-view'>
      <h2>Login</h2>
      <Form>
        <Form.Group controlId='formUsername'>
          <Form.Label>Username: </Form.Label>
          <Form.Control size='sm' type='text' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} /></Form.Group>
        <Form.Group controlId='formPassword'>
          <Form.Label>Password: </Form.Label>
          <Form.Control size='sm' type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant='primary' onClick={handleSubmit}>Submit</Button>
        <Form.Group controlId='newUser'>
          <Form.Text>New User? <Button id='registerButton' variant='link' onClick={() => props.onClick()}> Click here </Button></Form.Text>
        </Form.Group>
      </Form>
    </Container>
  );
}

LoginView.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  newUser: PropTypes.func.isRequired,
  onLoggedIn: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};