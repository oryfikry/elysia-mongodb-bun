import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js'; // Ensure this is correctly imported
import { CustomError } from '../utils/CustomError.js';
import { ResJson } from '../utils/ResJson.js';
import {arraysEqual} from '../utils/utils.js';

export const verifyToken = (roles = [],some=false,func=null) => {
  return async (req) => {
    const token = req.headers?.authorization?.split(' ')[1]; // Handle Bearer 
    console.log(req?.headers);
    if (!token) {
      return ResJson('Authorization token is missing','', 401);
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      // Check for roles if provided
      console.log(roles);
      console.log(decoded);
       if(some){
        if (!roles.some(role => decoded.role.includes(role))) {
          return ResJson("You don't have the required roles", '', 403);
        }
       }else{
         if (!arraysEqual(roles, decoded.role)) {
          // Find the roles required that are missing
          const missingRoles = roles.filter(role => !decoded.role.includes(role));
          const missingRolesString = missingRoles.join(', ');
  
          return ResJson(`You don't have the required roles: ${missingRolesString}`,'', 403);
        }
       }

      // Continue to the next middleware or route handler
      if(func){
        return func(req)
      }
      return true
    } catch (err) {
      console.log(err);
      return ResJson('Invalid or expired token','', 401);
    }
  };
};
