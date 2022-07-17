const express = require('express');
const app = express();
const cors = require('cors');
const dal = require('./dal');

// app.use(express.static('public'));
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
      error(res, 'Error: User already exist')
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
        error(res, 'Error: Wrong password')
      }
    } else {
      error(res, 'Error: User not found')
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
      error(res, 'Error: User not found')
    }
  } catch (error) {
    console.error(error);
    res.send({
      error,
    });
  }
});

// deposit
// app.get('/account/deposit/:amount', (req, res) => {
//   res.send({d
//     amount: req.params.amount,
//   });
// });

// withdraw
// app.get('/account/withdraw/:amount', (req, res) => {
//   res.send({
//     amount: req.params.amount,
//   });
// });

// all accounts
app.get('/account/all', async (req, res) => {
  const docs = await dal.all();
  console.log(docs);
  res.send(docs);
});

const port = 3000;
app.listen(port);
console.log(`Running on port: http://localhost:${port}`);
