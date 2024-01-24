const { default: mongoose } = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      // Mawini File id qilip qoyw kere
    },
    userId: {
      type: String,
      required: [true, "User id is required"],
      // Mawini User id qilip qoyw kere
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
