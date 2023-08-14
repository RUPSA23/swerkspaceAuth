const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const swaggerOptions = {
  swaggerDefinition: {
      info: {
          title: "Swerkspace API",
          description: "This is a Swagger Documentation",
          contact: {
              email: "anusuya.bhattacharjee23@gmail.com"
          },
          servers: ["http://localhost:8000"]
      }
  },
  apis: [path.join(__dirname, '../routes/auth-routes.js')] // Correct the path to your API file
};

  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  console.log(swaggerDocs);

module.exports = swaggerDocs;

