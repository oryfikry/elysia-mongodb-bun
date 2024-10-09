import { Elysia } from "elysia";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const employeeRoutes = new Elysia();

employeeRoutes.get(
  "/employees",
  verifyToken(["ADMIN"], false, getAllEmployees)
);
employeeRoutes.get(
  "/employees/:id",
  verifyToken(["ADMIN"], false, getEmployeeById)
);
employeeRoutes.post(
  "/employees",
  verifyToken(["ADMIN"], false, createEmployee)
);
employeeRoutes.put(
  "/employees/:id",
  verifyToken(["ADMIN"], false, updateEmployee)
);
employeeRoutes.delete(
  "/employees/:id",
  verifyToken(["ADMIN"], false, deleteEmployee)
);

export { employeeRoutes };
