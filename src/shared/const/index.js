exports.DATABASE = process.env.DATABASE;
exports.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
exports.DB = this.DATABASE.replace("<password>", this.DATABASE_PASSWORD);
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRES = process.env.JWT_EXPIRES;
exports.PORT = process.env.PORT || 8888;
exports.VIDEO_UPLOAD_TOKEN = process.env.VIDEO_UPLOAD_TOKEN;
exports.EMAIL_USERNAME = process.env.EMAIL_USERNAME;
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
exports.PROJECT_ID = process.env.PROJECT_ID;
exports.API_URL = process.env.API_URL;
exports.APP_URL = process.env.APP_URL;
exports.ADMIN_APP_URL = process.env.ADMIN_APP_URL;
exports.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
exports.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
exports.S3_ENDPOINT = process.env.S3_ENDPOINT;
exports.BUCKET_NAME = process.env.BUCKET_NAME;
exports.FILE_URL = process.env.FILE_URL;
exports.BUCKET_FOLDER_NAME = process.env.BUCKET_FOLDER_NAME;
exports.CORS_URLS = process.env.CORS_URLS;
exports.NODE_ENVIRONMENT = process.env.NODE_ENVIRONMENT;
exports.BOT_TOKEN = process.env.BOT_TOKEN;
exports.YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
exports.ADMINS_TGIDS = process.env.ADMINS_TGIDS
  ? process.env.ADMINS_TGIDS.split(",")
  : [];
  
//website roles
exports.ROLES = ["user", "admin", "superadmin"];

//image extensions

exports.imageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "tiff",
  "tif",
  "raw",
  "svg",
  "psd",
  "ai",
  "eps",
];
