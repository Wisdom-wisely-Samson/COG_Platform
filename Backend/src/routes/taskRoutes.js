import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import authorize
from "../middleware/roleMiddleware.js";

import {

  createTask,
  getTasks,
  getTask,
  updateTaskStatus,
  reviewTask,

}
from "../controllers/taskController.js";

const router =
  express.Router();
  router.post(
  "/",
  authMiddleware,
  authorize(
    "SUPER_ADMIN",
    "DEPARTMENT_HEAD"
  ),
  createTask
);

router.get(
  "/",
  authMiddleware,
  getTasks
);

router.get(
  "/:id",
  authMiddleware,
  getTask
);

router.patch(
  "/:id/status",
  authMiddleware,
  updateTaskStatus
);

router.patch(
  "/:id/review",
  authMiddleware,
  authorize(
    "SUPER_ADMIN",
    "DEPARTMENT_HEAD"
  ),
  reviewTask
);

export default router;