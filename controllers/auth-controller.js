const { validationResult } = require('express-validator');

const User = require('../models/user');
const {
    checkIfAccountExistByEmailAddress,
    isStringEmail,
    generateToken,
    hashPassword,
    generatePhoneOTP
  } = require("../helpers/auth-helper");

exports.getHome = async (req, res) => {
    try {
      await res.send('hello from Swerkspace !');
    } catch(e) {
      console.log(e);
      res.send(e);
    }
  }

  exports.register = async (req, res) => {
    try{
        const userType = req.body.userType;
        const firstName = req.body.firstName || null;
        const lastName = req.body.lastName || null;
        const emailAddress = req.body.emailAddress;
        const password = req.body.password;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array())
            return res.status(422).send({
              errorMessage: errors.array()[0].msg,
            });
          }
        
            const user = new User({
                userType: userType,
                firstName: firstName,
                lastName: lastName,
                emailAddress: emailAddress,
                password: await hashPassword(password),
                accountStatus: "approved"
            })
            const result = await user.save();
            console.log('User Created');
            console.log(result);
            res.status(200).send({
              message: "Your Account Successfully Registered, You Can Login Now",
              user: result
            });
          
    } catch(err) {
        console.log(err);
    }
}