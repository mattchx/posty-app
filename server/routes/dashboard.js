const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authorize");

// get all todos and name

router.get("/", authorize, async (req, res) => {
  try {
    // req.user has payload assigned in jwtGen
    // const user = await pool.query(
    //   'SELECT user_name FROM users WHERE user_id = $1',
    //   [req.user.id]
    // );

    const user = await pool.query(
      "SELECT u.user_name, t.todo_id, t.description FROM users AS u LEFT JOIN todos AS t ON u.user_id = t.user_id WHERE u.user_id = $1",
      [req.user.id]
    );

    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

// create a todo

router.post("/todos", authorize, async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todos (user_id, description) VALUES ($1, $2) RETURNING *",
      [req.user.id, description]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// update a todo
router.put("/todos/update/:id", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todos SET description = ($1) WHERE todo_id = ($2) AND user_id = ($3) RETURNING *;",
      [description, id, req.user.id]
    );

    if (updateTodo.rows.length === 0) {
      return res.json("This todo is not yours.");
    }

    res.json(updateTodo.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

// update a todo as complete
router.put("/todos/complete/:id", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const { complete } = req.body;
    const todo = await pool.query(
      "UPDATE todos SET complete = ($1) WHERE todo_id = ($2) AND user_id = ($3) RETURNING *;",
      [complete, id, req.user.id]
    );

    if (todo.rows.length === 0) {
      return res.json("This todo is not yours.");
    }

    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

// ** authorize provides req.user.id
// delete a todo
router.delete("/todos/:id", authorize, async (req, res) => {
  try {
    const { id } = req.params;

    const deleteTodo = await pool.query(
      "DELETE FROM todos WHERE todo_id = ($1) AND user_id = ($2)RETURNING *;",
      [id, req.user.id]
    );

    if (deleteTodo.rows.length === 0) {
      return res.json("This todo is not yours.");
    }

    res.json(deleteTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
