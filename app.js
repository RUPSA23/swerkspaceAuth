const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require("dotenv").config();

const app = express();
const authRoutes = require('./routes/auth-routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import Settings
const {
  _appProtocol,
  _appPort,
  _appUrl,
  _dbProtocol,
  _dbHost,
  _dbPort,
  _dbUser,
  _dbPassword,
  _dbName,
} = require("./helpers/settings-helper");

app.use(authRoutes);

// Creating Mongo URL
const mongoUrl = `${_dbProtocol}://${_dbHost}${_dbPort ? ":" + _dbPort : ""}/${_dbName}`;
console.log("Mongo URI: ",mongoUrl);

mongoose
  .connect(mongoUrl, {
    authSource: "admin",
    auth: {
      username: _dbUser,
      password: _dbPassword,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then((result) => {
    app.listen(_appPort, () => {
      console.log(`Server is listening on port ${_appPort}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });

