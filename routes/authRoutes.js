import {
    login,
    register
  } from "../controllers/authController.js";

import express from "express";

const router = express.Router();

// Auth Routes
router.post("/login", login);
router.post("/register", register);

export default router;