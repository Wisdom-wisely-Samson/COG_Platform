import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import authorize
from "../middleware/roleMiddleware.js";

import {

  createDeliverable,

  getTaskDeliverables,

  reviewDeliverable,

}
from "../controllers/deliverableController.js";

const router =
  express.Router();

router.post(
  "/",
  authMiddleware,
  createDeliverable
);

router.get(
  "/task/:taskId",
  authMiddleware,
  getTaskDeliverables
);

router.patch(
  "/:id/review",
  authMiddleware,
  authorize(
    "SUPER_ADMIN",
    "DEPARTMENT_HEAD"
  ),
  reviewDeliverable
);

export default router;