const AWS = require("aws-sdk");
 
const {
  S3_ENDPOINT,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
 } = require("../../shared/const");

 
const endpoint = new AWS.Endpoint(S3_ENDPOINT);

 
exports.s3 = new AWS.S3({
   endpoint,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
 