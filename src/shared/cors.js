const { CORS_URLS } = require("./const");

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || JSON.parse(CORS_URLS).includes(origin)) {
      callback(null, true);
    } else {
      callback(`"${origin}" is not allowed by CORS`);
    }
  },
};

module.exports = corsOptions;
