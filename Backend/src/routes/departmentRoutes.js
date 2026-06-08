import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import authorize
from "../middleware/roleMiddleware.js";

import {

  createDepartment,

  getDepartments,

  getDepartment,

  updateDepartment,

  deleteDepartment,

  assignDepartmentHead

}
from "../controllers/departmentController.js";

const router = express.Router();
router.post(
  "/",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  createDepartment
);

router.get(
  "/",
  authMiddleware,
  getDepartments
);

router.get(
  "/:id",
  authMiddleware,
  getDepartment
);

router.put(
  "/:id",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  updateDepartment
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  deleteDepartment
);

router.patch(
  "/assign-head",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  assignDepartmentHead
);

export default router;