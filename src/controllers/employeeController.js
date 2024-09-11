import { Employee } from "../models/Employee.js";
import { ResJson } from "../utils/ResJson.js"; // Ensure correct path
import { CustomError } from "../utils/CustomError.js"; // Ensure correct path
import { Validate } from "../utils/Validate.js";
export const getAllEmployees = async (req) => {
  try {
    const employees = await Employee.find();
    return ResJson("Employees retrieved successfully", employees, 200);
  } catch (error) {
    return ResJson("Error retrieving employees", null, 500);
  }
};

export const getEmployeeById = async (req) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      throw new CustomError("Employee not found", 404);
    }
    return ResJson("Employee retrieved successfully", employee, 200);
  } catch (error) {
    if (error instanceof CustomError) {
      return ResJson(error.message, null, error.status);
    }
    return ResJson("Error retrieving employee", null, 500);
  }
};

export const createEmployee = async (req) => {
  try {
    const { name, position, department, email } = req.body;
    const existingUser = await Employee.findOne({ email });
    if (existingUser) {
      return ResJson("This email already exist", null, 400);
    }

    const validationRules = [
      "name|required:true",
      "position|required:true",
      "department|required:true",
      "email|required:true",
    ];
    const validationResult = Validate(validationRules, req.body);
    if (!validationResult.valid) {
      return ResJson(validationResult.message, null, 400);
    }
    const newEmployee = new Employee({ name, position, department, email });
    await newEmployee.save();
    return ResJson("Employee created successfully", newEmployee, 201);
  } catch (error) {
    console.log(error);
    return ResJson("Error creating employee", null, 500);
  }
};

export const updateEmployee = async (req) => {
  try {
    const { name, position, department, email } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, position, department, email },
      { new: true }
    );
    if (!employee) {
      throw new CustomError("Employee not found", 404);
    }
    return ResJson("Employee updated successfully", employee, 200);
  } catch (error) {
    if (error instanceof CustomError) {
      return ResJson(error.message, null, error.status);
    }
    return ResJson("Error updating employee", null, 500);
  }
};

export const deleteEmployee = async (req) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      throw new CustomError("Employee not found", 404);
    }
    return ResJson("Employee deleted successfully", null, 204);
  } catch (error) {
    if (error instanceof CustomError) {
      return ResJson(error.message, null, error.status);
    }
    return ResJson("Error deleting employee", null, 500);
  }
};
