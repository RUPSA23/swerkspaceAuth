const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            res.status(401).send({
                message: "Unauthorized access"
            })
        }
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          const user = await User.findById(decodedToken.userId);
          if (user) {
            req.userData = user;
            req.token = token;
          } else {
            return res.status(401).send({
              message: "Invalid User Account Or Token",
            });
          }
          next();
    } catch (error) {
      return res.status(401).send({
        message: "Unauthenticated",
        error,
      });
    }
  }

module.exports = authMiddleware;