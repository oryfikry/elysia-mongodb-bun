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

  activityRoutes.get('/activities',verifyToken(["ADMIN"]), getAllActivities);
  activityRoutes.get('/activities/:id',verifyToken(["ADMIN"]), getActivityById);
  activityRoutes.post('/activities',verifyToken(["ADMIN"]), createActivity);
  activityRoutes.put('/activities/:id',verifyToken(["ADMIN"]), updateActivity);
  activityRoutes.delete('/activities/:id',verifyToken(["ADMIN"]), deleteActivity);


export { activityRoutes };
