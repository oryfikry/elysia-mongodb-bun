// src/models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false }, // Add a verified flag
  verificationToken: { type: String },         // Store verification token
  role: { type: [String], required: true }
});

export const User = mongoose.model('User', userSchema);
