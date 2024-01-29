const {  APP_URL } = require("./const");

const allowedOrigins = [  APP_URL];

const corsOptions = {
  origin: (origin, callback) => {
    console.log({ origin, callback });
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback( `"${origin}" is not allowed by CORS`) ;
    } 
  },
};

module.exports = corsOptions;
