import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import { Role } from "@prisma/client";

import auditController from "./audit.controller";


const router = Router();


router.use(
 authenticate,
 requireRole(Role.ADMIN)
);


router.get(
 "/",
 auditController.getLogs
);


export default router;