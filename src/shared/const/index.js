exports.DATABASE = process.env.DATABASE;
exports.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRES = process.env.JWT_EXPIRES;
exports.PORT = process.env.PORT || 8888;
exports.FILE_UPLOAD_TOKEN = process.env.FILE_UPLOAD_TOKEN;
exports.EMAIL_USERNAME = process.env.EMAIL_USERNAME;
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
exports.PROJECT_ID = process.env.PROJECT_ID;
exports.API_URL = process.env.API_URL;
exports.APP_URL = process.env.APP_URL;
exports.DB = this.DATABASE.replace("<password>", this.DATABASE_PASSWORD);

//website roles
exports.ROLES = ["user", "admin", "superadmin"];
