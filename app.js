const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require("dotenv").config();

const app = express();
const authRoutes = require('./routes/auth-routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(authRoutes);

// Fetching ENV Variables
const _dbProtocol = process.env.DB_PROTOCOL || "mongodb";
const _dbHost = process.env.DB_HOST || "0.0.0.0";
const _dbPort =
  process.env.DB_PORT && process.env.DB_PORT !== ""
    ? process.env.DB_PORT
    : null;
const _dbUser =
  process.env.DB_USER && process.env.DB_USER !== ""
    ? process.env.DB_USER
    : null;
const _dbPassword =
  process.env.DB_PASSWORD && process.env.DB_PASSWORD !== ""
    ? process.env.DB_PASSWORD
    : null;
const _dbName = process.env.DB_NAME || "SwerkspaceAuth";
// const _mongoLog = !!(process.env.MONGO_LOG && process.env.MONGO_LOG === "1");

// Creating Mongo URL
const mongoUrl = `${_dbProtocol}://${_dbHost}${
  _dbPort ? ":" + _dbPort : ""
}/${_dbName}`;

console.log("mongoUrl",mongoUrl);

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
    app.listen(process.env.APP_PORT, () => {
      console.log(`Server is listening on port ${process.env.APP_PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });

// mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vwrmjau.mongodb.net/SwerkspaceAuth?retryWrites=true&w=majority`, { useNewUrlParser: true })
// .then(result => {
//     app.listen(process.env.PORT, () => {
//       console.log(`Server is listening on port ${process.env.PORT}`);
//     });
// })
// .catch(err => {
//     console.error(err);
// })
