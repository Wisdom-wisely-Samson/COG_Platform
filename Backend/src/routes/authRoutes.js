import express from "express";

import {
    login
}
from "../controllers/authController.js";

const router = express.Router();

router.post(
    "/login",
    login
);
import authMiddleware
from "../middleware/authMiddleware.js";

import {
 getProfile
}
from "../controllers/authController.js";

router.get(
    "/profile",
    authMiddleware,
    getProfile
);
export default router;