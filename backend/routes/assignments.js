const express = require("express");
const router = express.Router();
const { auth, isTeacher, isStudent } = require("../middlewares/auth");
const {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  deleteAllAssignments,
  upload
} = require("../controllers/assignmentController");

// Get all assignments (filtered by course if specified)
router.get("/", auth, getAssignments);

// Create new assignment (teachers only)
router.post("/", auth, isTeacher, createAssignment);

// Update assignment (teachers only)
router.put("/:id", auth, isTeacher, updateAssignment);

// Delete assignment (teachers only)
router.delete("/:id", auth, isTeacher, deleteAssignment);

// Delete all assignments (teachers only)
router.delete("/", auth, isTeacher, deleteAllAssignments);

// Submit assignment (students only)
router.post("/submit", auth, submitAssignment);

module.exports = router; 