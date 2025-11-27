const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Task = require("../models/Task");

const router = express.Router();

// ------------------------
// JWT TOKEN GENERATOR
// ------------------------
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ------------------------
// SAMPLE TASK CREATOR
// ------------------------

// Creates sample demo tasks ONLY if user has no tasks yet
const ensureSampleTasksForUser = async (user) => {
  // check for any tasks linked with this user
  const existingCount = await Task.countDocuments({
    $or: [{ createdBy: user._id }, { assignedTo: user._id }]
  });

  if (existingCount > 0) return; // user already has tasks → skip

  let baseTasks = [];

  if (user.role === "manager") {
    baseTasks = [
      {
        title: "Plan sprint backlog",
        description: "Review pending tasks and prioritize stories for this week.",
        status: "todo",
        createdBy: user._id,
        assignedTo: user._id,
      },
      {
        title: "Team check-in meeting",
        description: "Schedule a 15-minute stand-up with the team.",
        status: "in-progress",
        createdBy: user._id,
        assignedTo: user._id,
      }
    ];
  } else if (user.role === "user") {
    baseTasks = [
      {
        title: "Complete onboarding tasks",
        description: "Go through project README and set up the environment.",
        status: "todo",
        createdBy: user._id,
        assignedTo: user._id,
      },
      {
        title: "Update profile",
        description: "Add your details so the manager can assign tasks properly.",
        status: "in-progress",
        createdBy: user._id,
        assignedTo: user._id,
      }
    ];
  }

  if (baseTasks.length > 0) {
    await Task.insertMany(baseTasks);
  }
};

// ------------------------
// USER SIGNUP
// ------------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role });

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user),
    });

  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------
// USER LOGIN
// ------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // CREATE SAMPLE TASKS ONLY IF USER HAS NONE
    await ensureSampleTasksForUser(user);

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user),
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
