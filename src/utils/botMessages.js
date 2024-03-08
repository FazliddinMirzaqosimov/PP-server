const { formatDate } = require(".");
const bot = require("../bot");
const { ADMINS_TGIDS } = require("../shared/const");

exports.sendToAdmins = (message) => {
  if (!message) {
    throw Error("message is required!")
  }
  ADMINS_TGIDS.forEach(async (adminId) => {
    try {
      if (typeof message === "string") {
        await bot.telegram.sendMessage(adminId, message);
      } else {
        await message(adminId)
      }
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
