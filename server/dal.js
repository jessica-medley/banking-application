const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI || process.env.MONGO_URL;
let db = null;

MongoClient.connect(url, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Connected successfully to db server');

  // connect to myproject database
  db = client.db('myproject');
});

// create user account
function create(name, email, password) {
  return new Promise((resolve, reject) => {
    const collection = db.collection('users');
    const doc = {
      name,
      email,
      password,
      balance: 100,
    };
    collection.insertOne(doc, { w: 1 }, (err, result) => {
      err ? reject(err) : resolve(doc);
    });
  });
}

// update - deposit/withdraw amount
function update(email, amount) {
  return new Promise((resolve, reject) => {
    db.collection('users').findOneAndUpdate(
      { email: email },
      { $inc: { balance: amount } },
      { returnOriginal: false },
      function (err, documents) {
        err ? reject(err) : resolve(documents);
      }
    );
  });
}

// all users
function all() {
  return new Promise((resolve, reject) => {
    db.collection('users')
      .find({})
      .toArray((err, docs) => {
        err ? reject(err) : resolve(docs);
      });
  });
}

// find user by email
function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.collection('users')
      .findOne({ email: email })
      .then((doc) => resolve(doc))
      .catch((err) => reject(err));
  });
}

// find users by email
function findUsersByEmail(email) {
  return new Promise((resolve, reject) => {
    db.collection('users')
      .find({ email: email })
      .toArray(function (err, docs) {
        err ? reject(err) : resolve(docs);
      });
  });
}

module.exports = {
  create,
  update,
  all,
  findUserByEmail,
  findUsersByEmail,
};
