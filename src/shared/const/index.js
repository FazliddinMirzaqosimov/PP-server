exports.DATABASE = process.env.DATABASE;
exports.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRES = process.env.JWT_EXPIRES;
exports.PORT = process.env.PORT || 8888;
exports.DB = this.DATABASE.replace("<password>", this.DATABASE_PASSWORD);

exports.ROLES = ["user", "admin", "superadmin"];
