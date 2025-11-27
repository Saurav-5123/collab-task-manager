// routes/taskRoutes.js
const express = require("express");
const Task = require("../models/Task");
const ActivityLog = require("../models/ActivityLog");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

const logActivity = async ({ taskId, action, performedBy, details }) => {
  await ActivityLog.create({ task: taskId, action, performedBy, details });
};

// Get tasks for current user (assigned + created)
router.get("/my-tasks", protect, async (req, res) => {
  try {
    const assignedTasks = await Task.find({ assignedTo: req.user._id })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    const createdTasks = await Task.find({ createdBy: req.user._id })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json({ assignedTasks, createdTasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Manager: create task
router.post("/", protect, requireRole("manager"), async (req, res) => {
  try {
    const { title, description, assignedTo, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      status: status || "todo",
      dueDate,
      createdBy: req.user._id,
    });

    await logActivity({
      taskId: task._id,
      action: "created",
      performedBy: req.user._id,
      details: "Task created",
    });

    const populated = await Task.findById(task._id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Manager: update task
router.put("/:id", protect, requireRole("manager"), async (req, res) => {
  try {
    const updates = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    await logActivity({
      taskId: task._id,
      action: "updated",
      performedBy: req.user._id,
      details: "Task updated",
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Manager: delete task
router.delete("/:id", protect, requireRole("manager"), async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await logActivity({
      taskId: task._id,
      action: "deleted",
      performedBy: req.user._id,
      details: "Task deleted",
    });

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// User: update own task status
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      assignedTo: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found or not assigned to you" });
    }

    task.status = status;
    await task.save();

    await logActivity({
      taskId: task._id,
      action: "status-changed",
      performedBy: req.user._id,
      details: `Status changed to ${status}`,
    });

    const populated = await Task.findById(task._id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Activity logs for a task
router.get("/:id/logs", protect, async (req, res) => {
  try {
    const logs = await ActivityLog.find({ task: req.params.id })
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
