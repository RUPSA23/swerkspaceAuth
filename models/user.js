const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const authTokenSchema = new mongoose.Schema(
    {
      token: {
        type: String,
        required: true,
      }
    }
  );

const userSchema = new Schema({
    userType: {
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    accountStatus:{
        type: String,
        required: false,
        default: "pending"
    },
    authTokens: [authTokenSchema]
},
{ timestamps: true }
);


// Compare password with hashed password in database
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };
  
  module.exports = mongoose.model("User", userSchema);