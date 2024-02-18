const { formatDate } = require(".");
const bot = require("../bot");
const { ADMINS_TGIDS } = require("../shared/const");

exports.sendToAdmins = (message) => {
  ADMINS_TGIDS.forEach(async (adminId) => {
    try {
      await bot.telegram.sendMessage(adminId, message);
    } catch (error) {
      console.log(error);
    }
  });
};

exports.senUserData = (title, user, tags = []) => {

    this.sendToAdmins(`
        ${title}
        
Email: ${user.email}
Phone: ${user.phone}
Verified At: ${formatDate(user.verifiedAt)}

${tags.map((tag) => "#" + tag).join(" ")}
    `);
};
