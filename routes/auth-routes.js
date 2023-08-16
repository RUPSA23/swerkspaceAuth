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
 *       id:
 *         type: integer
 *       userType:
 *         type: string
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       emailAddress:
 *         type: string
 *       password:
 *         type: string
 *       accountStatus:
 *         type: string
 *   User:
 *     type: object
 *     properties:
 *       userType:
 *         type: string
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       emailAddress:
 *         type: string
 *       password:
 *         type: string
 *       accountStatus:
 *         type: string
 *   LoginUser:
 *     type: object
 *     properties:
 *       emailAddress:
 *         type: string
 *       password:
 *         type: string
 *       rememberMe:
 *         type: boolean
 *   LogoutResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 *   ErrorResponse:
 *     type: object
 *     properties:
 *       errors:
 *         type: string
 *   InvalidResponse:
 *     type: object
 *     properties:
 *       statusCode:
 *         type: string
 *       message:
 *         type: string
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
 *       422:
 *         description: Unprocessable Entity
 *         schema:
 *           $ref: '#/definitions/InvalidResponse'
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
 *           $ref: '#/definitions/usersResponse'
 *       422:
 *         description: Unprocessable Entity
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
 *       500:
 *         description: Internal server error
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.delete('/logout', authMiddleware, authController.logout);

module.exports = router;