const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const mongoose = require("mongoose");
const { PORT, DB, API_URL, NODE_ENVIRONMENT } = require("./shared/const");
const bot = require("./bot");
const { sendToAdmins } = require("./utils/senData");

mongoose.connect(DB).then(() => {
  console.log("Database connected");
});

 

if (NODE_ENVIRONMENT === "development") {
  bot.launch();
} else {
  bot.createWebhook(API_URL);
  app.use(bot.webhookCallback("/webhook"));
}

app.listen(PORT, () => {
  console.log("Server is running in port - " + PORT);
});
