const path = require('path');
const express = require('express');
const authController = require('../controllers/auth-controller');
const { check, body } = require('express-validator');
const User = require('../models/user');
const authMiddleware = require('../middlewares/auth-middleware');
const {
    checkIfAccountExistByEmailAddress
  } = require("../helpers/auth-helper");

const router = express.Router();
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('../Utils/swagger');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
// router.use('/api-docs', swaggerUi.serve);
// router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log(swaggerDocument);

// /**
//  * @swagger
//  * /:
//  *   get:
//  *     description: Get Home Page!
//  *     responses:
//  *       200:
//  *         description: Success
//  */
router.get('/', authController.getHome);

// Register API
router.post('/register',
[
    body('firstName')
    .isString(),
    body('lastName')
    .isString(),
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
],
 authController.register);

// Login API
router.post('/login',
[
    body('emailAddress')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address.'),
    body('password')
    .isString()
    .isLength({min: 8, max: 32})
    .trim()
    .withMessage('Password must be at least 8 characters long'),
    body('rememberMe')
    .isBoolean()
    .default('false')
],
authController.login);

// Logout API 
router.delete('/logout', authMiddleware, authController.logout);

module.exports = router;