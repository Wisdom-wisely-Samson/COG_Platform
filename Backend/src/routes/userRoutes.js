import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import authorize
from "../middleware/roleMiddleware.js";

import {

    createUser,

    getUsers,

    getUser,

    updateUser,

    deactivateUser,

    reactivateUser

}
from "../controllers/userController.js";

const router = express.Router();
router.post(
    "/",
    authMiddleware,
    authorize("SUPER_ADMIN"),
    createUser
);

router.get(
    "/",
    authMiddleware,
    authorize(
        "SUPER_ADMIN",
        "DEPARTMENT_HEAD"
    ),
    getUsers
);

router.get(
    "/:id",
    authMiddleware,
    getUser
);

router.put(
    "/:id",
    authMiddleware,
    authorize("SUPER_ADMIN"),
    updateUser
);

router.patch(
    "/:id/deactivate",
    authMiddleware,
    authorize("SUPER_ADMIN"),
    deactivateUser
);

router.patch(
    "/:id/reactivate",
    authMiddleware,
    authorize("SUPER_ADMIN"),
    reactivateUser
);

export default router;