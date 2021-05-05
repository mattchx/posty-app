const router = require('express').Router();
const pool = require('../db');
const authorize = require('../middleware/authorize');

router.get('/', authorize, async (req, res) => {
  try {
    // req.user has payload assigned in jwtGen
    const user = await pool.query(
      'SELECT user_name FROM users WHERE user_id = $1',
      [req.user.id]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

module.exports = router;
