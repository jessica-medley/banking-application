const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const dal = require('./dal');
const {
  generateTokens,
  verifyToken,
  error,
  checkAccessTokenMiddleware,
} = require('./util');

/**
 * Error codes
 * 0 - Invalid/missing access token, call /token with refreshToken
 * 1 - Invalid/missing refresh token, reauthenticate.
 */

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
      const hashedPassword = await bcrypt.hash(password, salt);

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
  try {
    const refreshToken = req.header('x-auth-token');
    if (!refreshToken) {
      res.send({
        error: 'Error: Token not found',
        code: 1,
      });
    } else {
      const user = await verifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      // Delete the properties added by JWT, otherwise
      // the token doesn't update
      delete user.iat;
      delete user.exp;
      const { accessToken, refreshToken: newRefreshToken } =
        await generateTokens({
          ...user,
        });
      res.send({ accessToken, refreshToken: newRefreshToken });
    }
  } catch (error) {
    console.error(error);
    res.send({
      error: 'Error: Invalid refresh token',
      code: 1,
    });
  }
});

// Find user by email
app.get('/account/user', checkAccessTokenMiddleware, async (req, res) => {
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
});

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
        const updateResp = await dal.update(clientEmail, amount);
        updateResp.value.balance = user.balance + amount;
        res.send(updateResp)
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
