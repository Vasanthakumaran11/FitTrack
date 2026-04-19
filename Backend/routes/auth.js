// backend/routes/auth.js
const express = require("express");
const User = require("../models/User");

const router = express.Router();



router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.json({ success: false, msg: "All fields required" });
  }

  const user = new User({ username, email, password });
  await user.save();

  res.json({ success: true, msg: "User registered" });
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.json({ success: false, msg: "Invalid credentials" });
  }

  res.json({ success: true, msg: "Login successful", user });
});

module.exports = router;