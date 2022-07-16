const express = require('express');
const app = express();
const cors = require('cors');

// app.use(express.static('public'));
app.use(express.static('build'));
app.use(cors());

// create user account
app.get('/account/create/:name/:email/:password', (req, res) => {
  res.send({
    name: req.params.name,
    email: req.params.email,
    password: req.params.password,
  });
});

// login user
app.get('/account/login/:email/:password', (req, res) => {
  res.send({
    email: req.params.email,
    password: req.params.password,
  });
});

// all accounts
app.get('/account/all', (req, res) => {
  res.send({
    name: 'peter',
    email: 'peter@mit.edu',
    password: 'secret',
  });
});

const port = 3000;
app.listen(port);
console.log(`Running on port: http://localhost:${port}`);
