const express = require("express");

const app = express();

app.use(express.json());

// auth routes
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

module.exports = app;