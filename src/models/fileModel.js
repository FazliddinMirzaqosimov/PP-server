const { default: mongoose } = require("mongoose");
const { FILE_URL } = require("../shared/const");

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, "File is required"],
  },
  size: {
    type: Number,
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
});

 

const File = mongoose.model("File", fileSchema);
module.exports = File;
