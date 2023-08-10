const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.hashPassword = async (plaintTextPassword) => {
    const saltRounds = 10;
    return await new Promise((resolve, reject) => {
      bcrypt.hash(plaintTextPassword, saltRounds, function (err, hash) {
        if (err) reject(err);
        resolve(hash);
      });
    });
  };

  exports.isStringEmail = (string) => {
    if (
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        string
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  exports.checkIfAccountExistByEmailAddress = async (emailAddress) => {
    return User.findOne({
      emailAddress: emailAddress.toLowerCase(),
      password: {
        $ne: null,
      }
    });
  };

  exports.generateToken = async (userData) => {
    try {
      const token = await jwt.sign(userData, 
        process.env.ACCESS_TOKEN_SECRET);
      if (token) {
        await User.updateOne(
          {
            _id: userData.userId,
          },
          {
            $push: {
              authTokens: { token: token }
            },
          }
        );
      }

      // Return The Response
      return token;
    } catch (error) {
      // JWT Token Create Failure Console Log
      console.log("JWT Token Create Failure: ", error.message);
      // Return The Response
      return false;
    }
  };