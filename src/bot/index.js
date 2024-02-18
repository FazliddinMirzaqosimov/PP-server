const {Telegraf} = require("telegraf")
const { BOT_TOKEN } = require("../shared/const")

const bot = new Telegraf(BOT_TOKEN)



module.exports = bot