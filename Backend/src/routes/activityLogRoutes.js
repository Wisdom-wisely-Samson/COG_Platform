import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import {

  createActivity,

  getTaskActivities,

  getUserActivities,

  getDepartmentActivities,

}
from "../controllers/activityLogController.js";

const router =
  express.Router();
  router.post(
  "/",
  authMiddleware,
  createActivity
);

router.get(
  "/task/:taskId",
  authMiddleware,
  getTaskActivities
);

router.get(
  "/user/:userId",
  authMiddleware,
  getUserActivities
);

router.get(
  "/department/:departmentId",
  authMiddleware,
  getDepartmentActivities
);

export default router;