const { default: mongoose } = require("mongoose");

const courseSectionSchema = new mongoose.Schema(
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
      // Mawini object id qilip qoyw kere
    },
    userId: {
      type: String,
      required: [true, "User id is required"],
      // Mawini object id qilip qoyw kere
    },
    courseId: {
      type: String,
      required: [true, "Course id is required"],
      // Mawini object id qilip qoyw kere
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const CourseSection = mongoose.model("CourseSection", courseSectionSchema);
module.exports = CourseSection;
