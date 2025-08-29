const express = require("express");
const { register, login,getUsers } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// router.post("/register", register);
router.post("/login", login);
router.post("/register", authMiddleware, register); 
router.get("/staff", getUsers);  
module.exports = router;
