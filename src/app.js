const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
 const userRouter = require("./routers/userRouter");
const authRouter = require("./routers/authRouter");
// const articleRoutes = require("./routers/articleRouter");
// const categoryRoutes = require("./routers/categoryRouter");
// const productRoutes = require("./routers/productRouter");
// const mediaRoutes = require("./routers/mediaRouter");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/products", productRoutes);
// app.use("/api/v1/articles", articleRoutes);
// app.use("/api/v1/media", mediaRoutes);

module.exports = app;

 