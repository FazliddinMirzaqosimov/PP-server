const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./routers/userRouter");
const authRouter = require("./routers/authRouter");
const courseRouter = require("./routers/courseRouter");
const videoRouter = require("./routers/videoRouter");
const purchaseRouter = require("./routers/purchaseRouter");
const planRouter = require("./routers/planRouter");
const corsOptions = require("./shared/cors");
const sectionRouter = require("./routers/sectionRouter");
const progressRouter = require("./routers/progressRouter");
const fileRouter = require("./routers/fileRouter");
const purchaseRequestRouter = require("./routers/purchaseRequestRouter");
const { NODE_ENVIRONMENT } = require("./shared/const");

const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});
if (NODE_ENVIRONMENT === "development") {
  app.use(cors());
} else {
  app.use(cors(NODE_ENVIRONMENT !== "development" ? corsOptions : {}));
}

app.use(express.json());
app.use(morgan("dev"));
app.use("/api/v1/file", fileRouter);
app.use("/api/v1/progress", progressRouter);
app.use("/api/v1/purchase-request", purchaseRequestRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/course-section", sectionRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/plan", planRouter);

module.exports = app;
