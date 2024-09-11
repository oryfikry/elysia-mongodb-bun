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

if(verifyToken(["ADMIN"],true)){
  activityRoutes.get('/activities', getAllActivities);
}
activityRoutes.get('/activities/:id', getActivityById);
activityRoutes.post('/activities', createActivity);
activityRoutes.put('/activities/:id', updateActivity);
activityRoutes.delete('/activities/:id', deleteActivity);

export { activityRoutes };
