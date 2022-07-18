const express = require('express');
const app = express();
const cors = require('cors');
const dal = require('./dal');

// app.use(express.static('public'));
app.use(express.json());
app.use(express.static('build'));
app.use(cors());

function error(res, msg) {
  const ERROR_MSG = msg;
  console.log(ERROR_MSG);
  res.send({
    error: ERROR_MSG,
  });
}

// create user account
app.get('/account/create/:name/:email/:password', async (req, res) => {
  const { name, email, password } = req.params;
  try {
    let user;
    user = await dal.findUserByEmail(email);
    if (user) {
      error(res, 'Error: User already exist');
    } else {
      const user = await dal.create(name, email, password);
      console.log('Created user:');
      console.log(user);
      res.send(user);
    }
  } catch (error) {
    console.error(error);
    res.send({
      error,
    });
  }
});

// login to account
app.get('/account/login/:email/:password', async (req, res) => {
  const { email, password } = req.params;
  try {
    const user = await dal.findUserByEmail(email);
    if (user) {
      if (user.password === password) {
        res.send(user);
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

// Find user by email
app.get('/account/user/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await dal.findUserByEmail(email);
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
app.get('/account/update/:email/:amount', async (req, res) => {
  let { email, amount } = req.params;
  try {
    const user = await dal.findUserByEmail(email);
    if (user) {
      amount = parseFloat(amount);
      if (user.balance + amount < 0) {
        return error(res, 'Error: Overdrawn!');
      }
      const resp = await dal.update(email, amount);
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
});

// all accounts
app.get('/account/all', async (req, res) => {
  const docs = await dal.all();
  console.log(docs);
  res.send(docs);
});

const port = 3001;
app.listen(port);
console.log(`Running on port: http://localhost:${port}`);
