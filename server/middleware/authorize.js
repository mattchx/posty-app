const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  //get token from header
  const jwtToken = req.header('token');
  // check if no token
  if (!jwtToken) {
    return res.status(403).json('Not authorized');
  }
  // verify token
  try {
    const payload = jwt.verify(jwtToken, process.env.JWTSECRET);
    console.log(payload);
    req.user = payload.user;

    next();
  } catch (err) {
    console.error(err.message);
    res.status(403).json('Not authorized');
  }
};
