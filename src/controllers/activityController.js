import { Activity } from '../models/Activity.js';
import { Employee } from '../models/Employee.js';
import { ResJson } from '../utils/ResJson.js'; // Ensure correct path
import { CustomError } from '../utils/CustomError.js'; // Ensure correct path

export const getAllActivities = async (req) => {
  try {
    const activities = await Activity.find().populate('employee');
    return ResJson('Activities retrieved successfully', activities, 200);
  } catch (error) {
    return ResJson('Error retrieving activities', null, 500);
  }
};

export const getActivityById = async (req) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('employee');
    if (!activity) {
      throw new CustomError('Activity not found', 404);
    }
    return ResJson('Activity retrieved successfully', activity, 200);
  } catch (error) {
    if (error instanceof CustomError) {
      return ResJson(error.message, null, error.status);
    }
    return ResJson('Error retrieving activity', null, 500);
  }
};

export const createActivity = async (req) => {
  try {
    const { title, description, date, employeeId } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new CustomError('Employee not found', 404);
    }
    const newActivity = new Activity({ title, description, date, employee: employeeId });
    await newActivity.save();
    return ResJson('Activity created successfully', newActivity, 201);
  } catch (error) {
    if (error instanceof CustomError) {
      return ResJson(error.message, null, error.status);
    }
    return ResJson('Error creating activity', null, 500);
  }
};

export const updateActivity = async (req) => {
  try {
    const { title, description, date, employeeId } = req.body;
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      throw new CustomError('Activity not found', 404);
    }
    if (employeeId) {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new CustomError('Employee not found', 404);
      }
    }
    activity.title = title ?? activity.title;
    activity.description = description ?? activity.description;
    activity.date = date ?? activity.date;
    activity.employee = employeeId ?? activity.employee;
    await activity.save();
    return ResJson('Activity updated successfully', activity, 200);
  } catch (error) {
    if (error instanceof CustomError) {
      return ResJson(error.message, null, error.status);
    }
    return ResJson('Error updating activity', null, 500);
  }
};

export const deleteActivity = async (req) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      throw new CustomError('Activity not found', 404);
    }
    return ResJson('Activity deleted successfully', null, 204);
  } catch (error) {
    if (error instanceof CustomError) {
      return ResJson(error.message, null, error.status);
    }
    return ResJson('Error deleting activity', null, 500);
  }
};
