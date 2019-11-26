import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './registration-view.scss';
import PropTypes from 'prop-types';
import Axios from 'axios';

export function RegistrationView(props) {
  const [username, createUsername] = useState('');
  const [password, createPassword] = useState('');
  const [email, createEmail] = useState('');
  const [birthdate, createBirthdate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post('https://homeofhorror.herokuapp.com/users', {
      Username: username,
      Password: password,
      Email: email,
      Birthdate: birthdate
    })
      .then(response => {
        const data = response.data;
        console.log(data);
        window.open('/', '_self');
      })
      .catch(e => {
        console.log('error registering the user')
      });


    return (
      <Container className='regContainer'>
        <Form className='regForm'>
          <Form.Group controlId='formUsername'>
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" value={username} onChange={e => createUsername(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={e => createPassword(e.target.value)} />
          </Form.Group>
          <Form.Group controlId='formEmail'>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => createEmail(e.target.value)} />
          </Form.Group>
          <Form.Group controlId='formBirthdate'>
            <Form.Label>Birthdate</Form.Label>
            <Form.Control type="date" placeholder="MM/DD/YYYY" onChange={e => createBirthdate(e.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleSubmit}>Submit Registration</Button>
        </Form>
      </Container>
    );
  }
}
