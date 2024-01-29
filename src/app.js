const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./routers/userRouter");
const authRouter = require("./routers/authRouter");
const courseRouter = require("./routers/courseRouter");
const courseSectionRouter = require("./routers/courseSectionRouter");
const videoRouter = require("./routers/videoRouter");
const purchaseRouter = require("./routers/purchaseRouter");
const planRouter = require("./routers/planRouter");
const corsOptions = require("./shared/cors");

const app = express();

 
app.get("/", (req, res) => {
  res.send("hello");
});

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/course-section", courseSectionRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/plan", planRouter);

module.exports = app;
