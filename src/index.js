const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const mongoose = require("mongoose");
const { PORT, DB, API_URL, NODE_ENVIRONMENT } = require("./shared/const");
const bot = require("./bot");

mongoose.connect(DB).then(() => {
  console.log("Database connected");
});

 

if (NODE_ENVIRONMENT === "development") {
  bot.launch().then(console.log).catch(console.log);
  // console.log("Bot is running in local");
} else {
  bot.telegram.setWebhook(`${API_URL}/bot`);
  app.use(bot.webhookCallback("/bot"));
  // console.log("Bot is running in production");

}

app.listen(PORT, () => {
  console.log("Server is running in port - " + PORT);
});
