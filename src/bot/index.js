const { Telegraf, Markup } = require("telegraf");
const { BOT_TOKEN } = require("../shared/const");
const { InlineKeyboard } = require("telegraf");

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply("Bot is working!")
});
module.exports = bot;
