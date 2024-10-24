// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Registration Route
router.post("/register", async (req, res) => {
  const { name, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ name });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create a new user
    user = new User({
      name,
      password,
    });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, "randomSecretKey", { expiresIn: "1h" });

    res.json({ user, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    // Check if the user exists
    let user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    

    const token = jwt.sign(payload, "randomSecretKey", { expiresIn: "1h" });

    res.json({ user, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
