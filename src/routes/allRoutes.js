import { Elysia } from "elysia";
import { employeeRoutes } from "./employeeRoutes.js";
import { activityRoutes } from "./activityRoutes.js";
import { authRoutes } from "./authRoutes.js";

// Create a new Elysia instance
const allRoutes = new Elysia();

// Use imported routes
allRoutes.use(employeeRoutes);
allRoutes.use(activityRoutes);
allRoutes.use(authRoutes);

export { allRoutes };
