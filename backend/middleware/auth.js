// File: middleware/auth.js

import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // Get token from the header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add the user from the token's payload to the request object
    req.user = decoded.user;
    next(); // Move on to the next middleware or the route handler
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;