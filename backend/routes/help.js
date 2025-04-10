const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  submitHelp,
  getHelpSubmissions,
  updateHelpStatus
} = require("../controllers/helpController");

// Public route for submitting help requests
router.post("/submit", submitHelp);

// Protected routes for managing help submissions
router.get("/submissions", auth, getHelpSubmissions);
router.put("/submissions/:id/status", auth, updateHelpStatus);

module.exports = router; 