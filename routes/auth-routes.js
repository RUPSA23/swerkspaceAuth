const path = require('path');
const express = require('express');
const authController = require('../controllers/auth-controller');
const { body } = require('express-validator');
const User = require('../models/user');
const {
    checkIfAccountExistByEmailAddress
  } = require("../helpers/auth-helper");

const router = express.Router();

router.get('/', authController.getHome);

// Register API
router.post('/register',
[
    body('emailAddress')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address')
    .custom(async (value, { req }) => {
        const userDoc = await checkIfAccountExistByEmailAddress(value.toLowerCase());
        if (userDoc) {
            return Promise.reject('E-Mail exists already, please pick a different one.');
        }
    }),
    body('password')
    .isString()
    .isLength({min: 8, max: 32})
    .trim()
    .withMessage('Password must be at least 8 characters long')
], authController.register);

module.exports = router;