const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
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
      balance: 0,
    };
    collection.insertOne(doc, { w: 1 }, (err, result) => {
      err ? reject(err) : resolve(doc);
    });
  });
}

// all users
function all() {
  return new Promise((resolve, reject) => {
    const users = db
      .collection('users')
      .find({})
      .toArray((err, docs) => {
        err ? reject(err) : resolve(docs);
      });
  });
}

module.exports = {
  create,
  all
}
