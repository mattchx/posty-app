import { Fragment, useState } from 'react';
import {
  Divider,
  Flex,
  Button,
  Spacer,
  Box,
  Text,
  chakra,
  Input,
} from '@chakra-ui/react';
import axios from 'axios';

const ListTodo = ({
  todos,
  handleDeleteTodo,
  handleCompletedTodo,
  handleEditingState,
  handleUpdatedTodo,
}) => {
  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      token: localStorage.token,
    },
  };

  const initalTempTodos = todos.reduce((acc, cur) => {
    return { ...acc, [cur.todo_id]: cur.description };
  }, {});
  const [todosTempDesc, setTodosTempDesc] = useState(initalTempTodos);

  const deleteTodo = async id => {
    try {
      await axios.delete(
        `http://localhost:5000/dashboard/todos/${id}`,
        axiosConfig
      );
      handleDeleteTodo(id);
    } catch (err) {
      console.log(err.message);
    }
  };
  const todoIsComplete = async (id, complete) => {
    const toggle = !complete;
    try {
      const res = await axios.put(
        `http://localhost:5000/dashboard/todos/complete/${id}`,
        { complete: toggle.toString() },
        axiosConfig
      );
      handleCompletedTodo(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const editTodo = id => {
    handleEditingState(id, true);
  };

  const closeEdit = id => {
    handleEditingState(id, false);
  };

  const saveEdit = async (e, id) => {
    e.preventDefault();
    const newText = todosTempDesc[`${id}`];
    console.log(newText);
    try {
      const res = await axios.put(
        `http://localhost:5000/dashboard/todos/update/${id}`,
        { description: newText },
        axiosConfig
      );
      handleUpdatedTodo(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Box minW={300}>
      {todos &&
        todos.map(item => {
          return (
            <Fragment key={item.todo_id}>
              <Flex mt={3}>
                {!item.complete && item.editing ? (
                  <>
                    <form onSubmit={e => saveEdit(e, item.todo_id)}>
                      <Input
                        value={todosTempDesc[item.todo_id]}
                        type="text"
                        onChange={e =>
                          setTodosTempDesc({
                            ...todosTempDesc,
                            [item.todo_id]: e.target.value,
                          })
                        }
                      />
                      <Spacer />
                      <Button type="submit" size="xs" colorScheme="linkedin">
                        Save
                      </Button>
                      <Button
                        onClick={() => closeEdit(item.todo_id)}
                        size="xs"
                        colorScheme="blackAlpha"
                      >
                        Cancel
                      </Button>
                    </form>
                  </>
                ) : !item.complete ? (
                  <>
                    <chakra.span cursor="pointer">
                      <Text
                        onClick={() =>
                          todoIsComplete(item.todo_id, item.complete)
                        }
                      >
                        {item.description}
                      </Text>
                    </chakra.span>
                    <Spacer />
                    <Button
                      onClick={() => editTodo(item.todo_id)}
                      size="xs"
                      colorScheme="yellow"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteTodo(item.todo_id)}
                      size="xs"
                      colorScheme="red"
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <chakra.span cursor="pointer">
                    <Text
                      complete
                      color="gray"
                      as="s"
                      onClick={() =>
                        todoIsComplete(item.todo_id, item.complete)
                      }
                    >
                      {item.description}
                    </Text>
                  </chakra.span>
                )}
              </Flex>
              <Divider m={3} />
            </Fragment>
          );
        })}
    </Box>
  );
};

export default ListTodo;
