import { Elysia } from "elysia";
import {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../controllers/activityController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const activityRoutes = new Elysia();

activityRoutes.get(
  "/activities",
  verifyToken(["ADMIN"], false, getAllActivities)
);
activityRoutes.get(
  "/activities/:id",
  verifyToken(["ADMIN"], false, getActivityById)
);
activityRoutes.post(
  "/activities",
  verifyToken(["ADMIN"], false, createActivity)
);
activityRoutes.put(
  "/activities/:id",
  verifyToken(["ADMIN"], false, updateActivity)
);
activityRoutes.delete(
  "/activities/:id",
  verifyToken(["ADMIN"], false, deleteActivity)
);

export { activityRoutes };
