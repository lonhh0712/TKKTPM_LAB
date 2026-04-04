const express = require("express");

const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/me", authMiddleware, userController.me);

module.exports = router;
