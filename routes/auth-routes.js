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

const swaggerDocs = require('../Utils/swagger');
const swaggerUi = require("swagger-ui-express");

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * definitions:
 *   usersResponse:
 *     type: object
 *     properties:
 *       message: 
 *          type: string
 *          default: "Your Account Successfully Registered, You Can Login Now"
 *       user: 
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *              default: 64d4a9ed4df84e38fea30f3f
 *            userType:
 *              type: string
 *              default: "Buyer"
 *            firstName:
 *              type: string
 *              default: "Anusuya"
 *            lastName:
 *              type: string
 *              default: "Bhattacharjee"
 *            emailAddress:
 *              type: string
 *              default: "anusuya23@gmail.com"
 *            password:
 *              type: string
 *              default: "admin12345"
 *   User:
 *     type: object
 *     properties:
 *       userType:
 *         type: string
 *         default: "Buyer"
 *       firstName:
 *         type: string
 *         default: "Anusuya"
 *       lastName:
 *         type: string
 *         default: "Bhattacharjee"
 *       emailAddress:
 *         type: string
 *         default: "anusuya23@gmail.com"
 *       password:
 *         type: string
 *         default: "admin12345"
 *   LoginUser:
 *     type: object
 *     properties:
 *       emailAddress:
 *         type: string
 *         default: "anusuya23@gmail.com"
 *       password:
 *         type: string
 *         default: "admin12345"
 *       rememberMe:
 *         type: boolean
 *         default: true
 *   LogoutResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 *         default: "Logout Successful"
 *   ErrorResponse:
 *     type: object
 *     properties:
 *       statusCode:
 *         type: string
 *         default: "422"
 *       errors:
 *         type: string
 *   InvalidResponse:
 *     type: object
 *     properties:
 *       statusCode:
 *         type: string
 *         default: "422"
 *       message:
 *         type: string
 *         default: "Unable To Generate JWT Token"
 *   InvalidRegisterResponse:
 *     type: object
 *     properties: 
 *       statusCode: 
 *         type: string
 *         default: "403"
 *       message:
 *         type: string
 *         default: "Please Enter valid field"
 *   InternalServerErrorResponse: 
 *      type: object
 *      properties: 
 *        statusCode: 
 *          type: string
 *          default: "500"
 *        message:
 *          type: string
 *          default: "Unable To Create Your Account. Please Try Again"
 *   LoginUserResponse: 
 *      type: object
 *      properties:
 *        message: 
 *          type: string
 *          default: "Login Successful"
 *        token: 
 *          type: string
 *          default: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGQ0YWU5NmMxZWM2YTc4YmUyZTc1M2MiLCJ2YWxpZFRpbGwiOjE2OTk1OTMyNzI1MzAsImlhdCI6MTY5MTgxNzI3Mn0.fOruaSEhJg0opF0dJcGCxFD6JKA-hHd662oK-ZsZ5CA"
 */

// Routes
/**
 * @swagger
 * /:
 *   get:
 *     summary: Get Home Page
 *     description: Get Home Page
 *     tags:
 *       - Default
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: Invalid status value
 */
router.get('/', authController.getHome);

// Register API
/**
 * @swagger
 * /register:
 *   post:
 *     summary: User registration
 *     description: User registration
 *     tags:
 *       - Auth
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User registration object
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           $ref: '#/definitions/usersResponse'
 *       403:
 *         description: Validation Error
 *         schema:
 *           $ref: '#/definitions/InvalidRegisterResponse'
 *       500: 
 *          description: Internal Server Error
 *          schema:
 *            $ref: '#/definitions/InternalServerErrorResponse' 
 */      
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
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User Login
 *     description: User Login
 *     tags:
 *       - Auth
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User Login object
 *         required: true
 *         schema:
 *           $ref: '#/definitions/LoginUser'
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           $ref: '#/definitions/LoginUserResponse'
 *       422:
 *         description: Unprocessable entity
 *         schema:
 *           $ref: '#/definitions/InvalidResponse'
 */
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
/**
 * @swagger
 * /logout:
 *   delete:
 *     summary: User Logout
 *     description: User Logout
 *     tags:
 *       - Auth
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     security:
 *       - bearerAuth: []   
 *     responses:
 *       200:
 *         description: Logout successful
 *         schema:
 *           $ref: '#/definitions/LogoutResponse'
 *       422:
 *         description: Unprocessable entity
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.delete('/logout', authMiddleware, authController.logout);

module.exports = router;