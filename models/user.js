const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

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
    }
},
{ timestamps: true }
);


// Compare password with hashed password in database
userSchema.methods.comparePassword = async function (candidatePassword) {
    // console.log("hashed password" + this.password)
    return await bcrypt.compare(candidatePassword, this.password);
  };
  
  module.exports = mongoose.model("User", userSchema);