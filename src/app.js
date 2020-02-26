const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, `../config/${process.env.NODE_ENV}.env`) 
});

const express = require('express');
const routes = require('./routes/index');
const database = require('./database');
const authMiddleware = require('./middlewares/auth');

const app = express();

const setupExpress = async () => {
  app.use(express.json());
  app.use(authMiddleware);
  app.use('/', routes);
  app.database = database;
  await app.database.connect();

  return app;
};

module.exports = setupExpress;
