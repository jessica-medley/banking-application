const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

mongoClient.connect(url, (err, client) => {
  console.log('Connected!');

  // DB name
  const dbName = 'myproject';
  const db = client.db(dbName);

  // New user
  const name = 'user' + Math.floor(Math.random() * 10000);
  const email = name + '@mit.edu';

  // insert into customer table
  const collection = db.collection('customers');
  const doc = {
    name,
    email,
  };
  collection.insertOne(doc, { w: 1 }, function (err, result) {
    console.log('Document insert');
  });

  const customers = db
    .collection('customers')
    .find()
    .toArray((err, docs) => {
      console.log('Collection:', docs);
      // clean up
      client.close();
    });
});
