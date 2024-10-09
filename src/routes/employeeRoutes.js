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

if(verifyToken(["ADMIN"],true)){
  employeeRoutes.get('/employees', getAllEmployees);
  employeeRoutes.get('/employees/:id', getEmployeeById);
  employeeRoutes.post('/employees', createEmployee);
  employeeRoutes.put('/employees/:id', updateEmployee);
  employeeRoutes.delete('/employees/:id', deleteEmployee);
}

export { employeeRoutes };
