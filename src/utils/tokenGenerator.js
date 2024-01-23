const  jwt  = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES } = require("../shared/const");

const generateToken = (data) => {
    return jwt.sign(data, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });
  };
  

  module.exports = generateToken