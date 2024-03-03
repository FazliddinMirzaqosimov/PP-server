const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Fazliddin.dev",
    description: "Description",
  },
  host: "localhost:8888",
};

const outputFile = "./swagger.json";
const routes = ["../app.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
