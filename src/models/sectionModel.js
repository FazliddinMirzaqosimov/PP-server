const { default: mongoose } = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
    order: { 
      type: Number,
      required: [true, "Order is required"],
    },
    userId: {
      required: [true, "User id is required"],
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course id is required"],
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
const Section = mongoose.model("Section", sectionSchema);
  //  Section.db
  //   .collection("sections").
  //   dropIndex("courseId_1_order_1")
  //   .then(console.log)
  //   .catch(console.error)
 
module.exports = Section;
