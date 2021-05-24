import React, { Fragment, useState, useEffect } from 'react';
import { Button, Text, Center, Box } from '@chakra-ui/react';
import axios from 'axios';
import { toast } from 'react-toastify';

import InputTodo from './todolist/InputTodo';
import ListTodos from './todolist/ListTodos';

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState('');
  const [todos, setTodos] = useState([]);

  const getProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/dashboard', {
        headers: { token: localStorage.token },
      });
      setName(res.data[0].user_name);
      const todosState = res.data.map(item => ({
        ...item,
        editing: false,
      }));
      setTodos(todosState);
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
    console.error('useEffect runs');
    getProfile();
  }, []);

  const handleAddTodo = data => {
    setTodos([...todos, data]);
  };

  const handleDeleteTodo = id => {
    setTodos(todos.filter(todo => todo.todo_id !== id));
  };
  const handleCompletedTodo = item => {
    setTodos(
      todos.map(todo => {
        if (todo.todo_id === item.todo_id) {
          return item;
        }
        return todo;
      })
    );
  };

  const handleEditingState = (id, state) => {
    setTodos(
      todos.map(item => {
        if (item.todo_id === id) {
          return { ...item, editing: state };
        }
        return item;
      })
    );
  };

  const handleUpdatedTodo = todo => {
    console.log(todo);
    setTodos(
      todos.map(item => {
        if (item.todo_id === todo.todo_id) {
          return todo;
        } else {
          return item;
        }
      })
    );
  };

  return (
    <Fragment>
      <Text fontSize="5xl">Dashboard</Text>
      <Text fontSize="2xl">Welcome {name}</Text>

      <Button onClick={e => logout(e)}>Log out</Button>

      <Center mt={20}>
        <Box width={500}>
          <InputTodo handleAddTodo={handleAddTodo} />
          <Center>
            <ListTodos
              todos={todos}
              handleDeleteTodo={handleDeleteTodo}
              handleCompletedTodo={handleCompletedTodo}
              handleEditingState={handleEditingState}
              handleUpdatedTodo={handleUpdatedTodo}
            />
          </Center>
        </Box>
      </Center>
    </Fragment>
  );
};

export default Dashboard;
