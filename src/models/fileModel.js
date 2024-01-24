const { default: mongoose } = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, "File is required"],
  },
});

const File = mongoose.model("File", fileSchema);
module.exports = File;
