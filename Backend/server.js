// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/fitnessDB")
  .then(() => console.log("DB connected"));

app.use("/api", authRoutes);

app.listen(5000, () => console.log("Server running"));