const { Telegraf, Markup } = require("telegraf");
const { BOT_TOKEN } = require("../shared/const");
const { InlineKeyboard } = require("telegraf");

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  try {
    ctx.replyWithHTML(
      "texts",
      Markup.inlineKeyboard([
        Markup.button.webApp(
          "Open",
          "https://app.fazliddin.dev"
        ),
      ])
    );
  } catch (error) {
    console.log({ error });
  }
});

module.exports = bot;
