const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validInfo');
const authorize = require('../middleware/authorize');

// REGISTER route
router.post('/register', validInfo, async (req, res) => {
  // 1. Deconstruct data from body
  const { name, email, password } = req.body;
  try {
    // 2. Check if user already exists
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).send('User already exists');
    }
    // 3. Create an encrypted password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4.Add user to db
    const newUser = await pool.query(
      'INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, bcryptPassword]
    );

    // 5.Generate JWT pass with user id
    const token = jwtGenerator(newUser.rows[0].user_id);
    res.json({ token });

    // Error Handling
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// LOGIN route
router.post('/login', validInfo, async (req, res) => {
  // 1. Destruct data from body
  const { email, password } = req.body;

  try {
    // 2. Check if user already exists
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json('Password or Email is incorrect');
    }

    // 3. check if incoming password is the same as database password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    ); // return boolean

    if (!validPassword) {
      return res.status(401).json('Password or Email is incorrect');
    }

    // 4. Generate JWT pass with user id
    const token = jwtGenerator(user.rows[0].user_id);
    res.json({ token });

    // Error Handling
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/verify', authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
