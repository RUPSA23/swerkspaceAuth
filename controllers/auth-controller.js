const { validationResult } = require('express-validator');

const User = require('../models/user');
const {
    checkIfAccountExistByEmailAddress,
    isStringEmail,
    generateToken,
    hashPassword
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

        console.log(userType, firstName, lastName, emailAddress, password)

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

exports.login = async (req, res) => {
    try{
        const email = req.body.emailAddress;
        const password = req.body.password;
        const rememberMe =  req.body.rememberMe;
  
            // Check If User Does Exist
            const user = isStringEmail(email) && 
            await checkIfAccountExistByEmailAddress(
              email.toLowerCase()
            )
      
            if(user){
          // Compare Password And Log User In
          if (await user.comparePassword(password, user.password)) {
  
            // Prepare JWT Data
            const userData = {
              userId: user._id,
              email: user.email,
              validTill: new Date().setDate(
                new Date().getDate() + (rememberMe ? 90 : 7)
              ),
            };
  
            // Generate JWT Token
            const userToken = await generateToken(userData);
  
            // Return Response
            if (userToken) {
              // Return The Response
              return res.status(200).send({
                message: "Login Successful",
                token: userToken,
              });
            } else {
              return res.status(500).send({
                message: "Unable To Generate JWT Token",
              });
            }
          }
            }
    } catch(err) {
    // Return Error And Log It Over Console
    console.log(`auth-controller-controller -> login : ${err.message}`);
    return res.status(500).send({
      errors: err.message,
    });
    }
  }

  exports.logout = async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      await User.updateOne(
        { _id: req.userData._id },
        {
          $pull: { authTokens: { token } },
        }
      );
      return res.status(200).send({
        message: "Logout Successful",
      });
    } catch (error) {
      // Return Error And Log It Over Console
      console.log(`auth-controller-controller -> logout : ${error.message}`);
      return res.status(500).send({
        errors: error.message,
      });
    }
  };