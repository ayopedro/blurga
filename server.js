require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser")();
const cors = require("cors")();
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnection");

const root = require("./routes/root");
const articles = require("./routes/api/articles");
const users = require("./routes/api/users");


const app = express();
const PORT = 5000 || process.env.PORT;

connectDB();

app.use(cors);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser);

app.use("/", root);
app.use("/users", users);
app.use("/articles", articles);

app.get("/*", (req, res) => {
  res.status(404).json({ message: "Page not found!" });
});

mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
  });
});
