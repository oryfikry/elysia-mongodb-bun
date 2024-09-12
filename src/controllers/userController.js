import { User } from "../models/userModel";
import { ResJson } from "../utils/ResJson";

export const getAllUsers = async (req) => {
    try {
      const user = await User.find().select('-password -__v');
      return ResJson("User retrieved successfully", user, 200);
    } catch (error) {
        console.log(error);
      return ResJson("Error retrieving user", null, 500);
    }
  };