'use strict';

const express    = require('express');
const bodyParser = require('body-parser');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const mongo      = require('mongodb').MongoClient;

const routes = require('./routes.js');
const auth = require('./auth.js');

const app = express();

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');

mongo.connect(process.env.DATABASE, { useNewUrlParser: true }, (err, db) => {
  if (err) {
    console.log('Database error: ' + err);
  } else {
    console.log('Successful database connection');
    
    auth(app, db);
    routes(app, db);
    
    // app.listen
    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });
  }
});

// Enables to pass the challenge called "Advanced Node and Express - Registration of New Users"
if (process.env.ENABLE_DELAYS) {
  app.use((req, res, next) => {
    return setTimeout(() => next(), 500);
  });
}
