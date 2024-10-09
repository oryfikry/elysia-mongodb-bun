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

  employeeRoutes.get('/employees',verifyToken(["ADMIN"]), getAllEmployees);
  employeeRoutes.get('/employees/:id',verifyToken(["ADMIN"]), getEmployeeById);
  employeeRoutes.post('/employees',verifyToken(["ADMIN"]), createEmployee);
  employeeRoutes.put('/employees/:id',verifyToken(["ADMIN"]), updateEmployee);
  employeeRoutes.delete('/employees/:id',verifyToken(["ADMIN"]), deleteEmployee);


export { employeeRoutes };
