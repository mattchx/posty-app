import React, { Fragment, useState, useEffect } from 'react';
import { Button, Text } from '@chakra-ui/react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState('');

  const getName = async () => {
    try {
      const response = await axios.get('http://localhost:5000/dashboard', {
        headers: { token: localStorage.token },
      });
      setName(response.data.user_name);
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = e => {
    e.preventDefault();
    localStorage.removeItem('token');
    setAuth(false);
    toast.success('You have successfully logged out.');
  };

  useEffect(() => {
    getName();
  }, []);

  return (
    <Fragment>
      <Text fontSize="5xl">Dashboard</Text>
      <Text fontSize="2xl">Welcome {name}</Text>

      <Button onClick={e => logout(e)}>Log out</Button>
    </Fragment>
  );
};

export default Dashboard;
