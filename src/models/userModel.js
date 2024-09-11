// src/models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: Array, default: 'user' } // Default role is 'user', can be changed to 'admin', etc.
});

export const User = mongoose.model('User', userSchema);
