const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dal = require('./dal');
const {
  generateTokens,
  verifyToken,
  error,
  checkAccessTokenMiddleware,
} = require('./util');

dotenv.config();

app.use(express.json());
app.use(express.static('build'));
app.use(cors());

// create user account
app.post('/account/create/:name/:email/:password', async (req, res) => {
  const { name, email, password } = req.params;
  try {
    let user;
    user = await dal.findUserByEmail(email);
    if (user) {
      error(res, 'Error: User already exist');
    } else {
      const salt = await bcrypt.genSalt(10);
      console.log('salt:', salt);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log('hashed password:', hashedPassword);

      // Add new user to database.
      const user = await dal.create(name, email, hashedPassword);

      const { accessToken, refreshToken } = await generateTokens(user);
      res.send({ accessToken, refreshToken });
    }
  } catch (error) {
    console.error(error);
    res.send({
      error,
    });
  }
});

// login to account
app.post('/account/login/:email/:password', async (req, res) => {
  const { email, password } = req.params;
  try {
    const user = await dal.findUserByEmail(email);
    if (user) {
      let isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const { accessToken, refreshToken } = await generateTokens(user);
        res.send({ accessToken, refreshToken });
      } else {
        error(res, 'Error: Wrong password');
      }
    } else {
      error(res, 'Error: User not found');
    }
  } catch (error) {
    console.error(error);
    res.send({
      error,
    });
  }
});

// Create new access token from refresh token
app.post('/token', async (req, res) => {
  const refreshToken = req.header('x-auth-token');
  if (!refreshToken) {
    res.send({
      error: 'Error: Token not found',
    });
  }

  try {
    const user = await verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const { accessToken, refreshToken } = await generateTokens(user);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    res.send({
      error: 'Error: Invalid refresh token',
    });
  }
});

// Find user by email
app.get(
  '/account/user',
  checkAccessTokenMiddleware,
  async (req, res) => {
    // Added to req by middleware.
    const { clientUser: { email: clientEmail } = {} } = req;
    try {
      const user = await dal.findUserByEmail(clientEmail);
      if (user) {
        res.send(user);
      } else {
        error(res, 'Error: User not found');
      }
    } catch (error) {
      console.error(error);
      res.send({
        error,
      });
    }
  }
);

// update - deposit/withdraw amount
app.post(
  '/account/update/:amount',
  checkAccessTokenMiddleware,
  async (req, res) => {
    let { amount } = req.params;
    // Added to req by middleware.
    const { clientUser: { email: clientEmail } = {} } = req;
    try {
      const user = await dal.findUserByEmail(clientEmail);
      if (user) {
        amount = parseFloat(amount);
        if (user.balance + amount < 0) {
          return error(res, 'Error: Overdrawn!');
        }
        const resp = await dal.update(clientEmail, amount);
        console.log(resp);
        res.send(resp);
      } else {
        error(res, 'Error: User not found');
      }
    } catch (error) {
      console.error(error);
      res.send({
        error,
      });
    }
  }
);

// all accounts
app.get('/account/all', async (req, res) => {
  const docs = await dal.all();
  console.log(docs);
  res.send(docs);
});

const port = 3001;
app.listen(port);
console.log(`Running on port: http://localhost:${port}`);
