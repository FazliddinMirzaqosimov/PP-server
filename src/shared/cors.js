const { APP_URL, ADMIN_APP_URL } = require("./const");

const allowedOrigins = [APP_URL, ADMIN_APP_URL];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(`"${origin}" is not allowed by CORS`);
    }
  },
};

module.exports = corsOptions;
