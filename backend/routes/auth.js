const express = require("express");
const { signup, login, getProfile, logout, changePassword } = require("../controllers/authController");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.post("/logout", logout);
router.post("/change-password", auth, changePassword);

module.exports = router;