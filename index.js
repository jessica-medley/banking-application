const express = require('express');
const app = express();
const cors = require('cors');
const dal = require('./dal');

// app.use(express.static('public'));
app.use(express.static('build'));
app.use(cors());

// create user account
app.get('/account/create/:name/:email/:password', (req, res) => {
  const { name, email, password } = req.params;
  dal.create(name, email, password).then((user) => {
    console.log(user);
    res.send(user);
  });
});

// login to account
// app.get('/account/login/:email/:password', (req, res) => {
//   res.send({
//     email: req.params.email,
//     password: req.params.password,
//   });
// });

// deposit
// app.get('/account/deposit/:amount', (req, res) => {
//   res.send({
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
app.get('/account/all', (req, res) => {
  dal.all().then((docs) => {
    console.log(docs);
    res.send(docs);
  });
});

const port = 3000;
app.listen(port);
console.log(`Running on port: http://localhost:${port}`);
