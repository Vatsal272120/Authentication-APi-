const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const PORT = process.env.PORT || 3001;

// Routes
const authRoute = require("./routes/auth");

// db config
const db_connect = ` mongodb+srv://home:Nn3mbJGeMsTUQiTs@cluster0.myqh1.mongodb.net/home?retryWrites=true&w=majority`;
mongoose.connect(
  db_connect,
  { useNewUrlParser: true },
  { useUnifiedTopology: true },
  () => {
    console.log(`db connected`);
  }
);

// middlewares
app.use(express.json());

// Route Middlewares
app.use("/api/user", authRoute);

// listen
app.listen(PORT, () => {
  console.log(` Server up and running on ${PORT}`);
});

// Nn3mbJGeMsTUQiTs
