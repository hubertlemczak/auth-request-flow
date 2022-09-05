require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const mockUser = {
  username: 'authguy',
  password: 'mypassword',
  profile: {
    firstName: 'Chris',
    lastName: 'Wolstenholme',
    age: 43,
  },
};

const authorizeUser = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const verifiedData = jwt.verify(token, JWT_SECRET);
    req.verifiedData = verifiedData;
  } catch (error) {
    return res.sendStatus(403);
  }
  next();
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing fields in request body' });
  }

  if (username === mockUser.username && password === mockUser.password) {
    const authToken = jwt.sign({ username: mockUser.username }, JWT_SECRET);
    return res.status(201).json({ authToken });
  }

  res.status(403).json({ error: 'Invalid username / password' });
});

router.get('/profile', authorizeUser, (req, res) => {
  res.status(200).json({ user: mockUser });
});

module.exports = router;
