const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const mongoose = require("mongoose");
const { PORT,   DB } = require("./shared/const");
 

mongoose.connect(DB).then(() => {
  console.log("Database connected");
});

app.listen(PORT, () => {
  console.log("Server is running in port - " + PORT);
});  