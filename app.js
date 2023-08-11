const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require("dotenv").config();

const app = express();
const authRoutes = require('./routes/auth-routes');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(authRoutes);

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vwrmjau.mongodb.net/SwerkspaceAuth?retryWrites=true&w=majority`, { useNewUrlParser: true })
.then(result => {
    app.listen(4000, () => {
      console.log('Server is listening on port 4000')
    });
})
.catch(err => {
    console.error(err);
})
