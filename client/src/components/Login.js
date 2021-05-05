import React, { Fragment, useState } from 'react';
import { Stack, Input, Container, Text, Button } from '@chakra-ui/react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });

  const onInputChange = e => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const submitForm = async e => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/auth/login',
        inputs
      );
      console.log(response);

      const { token } = response.data;
      if (token) {
        // set Local Storage
        localStorage.setItem('token', token);
        setAuth(true);
        toast.success('You successfully logged in!');
      }
    } catch (err) {
      console.error(err.response.data);
      setAuth(false);
      toast.error(err.response.data);
    }
  };

  const { email, password } = inputs;

  return (
    <Fragment>
      <Container>
        <Text pl={4} fontSize="4xl" mt={7} mb={7}>
          Login
        </Text>
        <form onSubmit={submitForm}>
          <Stack spacing={5}>
            <Input
              onChange={e => onInputChange(e)}
              value={email}
              type="email"
              name="email"
              placeholder="Email"
            />
            <Input
              onChange={e => onInputChange(e)}
              value={password}
              type="password"
              name="password"
              placeholder="Password"
            />
            <Button type="submit" colorScheme="linkedin" color="white">
              Submit
            </Button>
          </Stack>
        </form>

        <RouterLink to="/register">Register</RouterLink>
      </Container>
    </Fragment>
  );
};

export default Login;
