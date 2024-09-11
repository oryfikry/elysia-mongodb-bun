import { Elysia } from "elysia";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

const employeeRoutes = new Elysia();

employeeRoutes.get('/employees', getAllEmployees);
employeeRoutes.get('/employees/:id', getEmployeeById);
employeeRoutes.post('/employees', createEmployee);
employeeRoutes.put('/employees/:id', updateEmployee);
employeeRoutes.delete('/employees/:id', deleteEmployee);

export { employeeRoutes };
