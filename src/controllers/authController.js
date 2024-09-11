// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { JWT_SECRET } from "../config.js";
import { ResJson } from "../utils/ResJson.js";

// Register a new user
export const register = async (req) => {
  try {
    const { username, password, email, role } = req.body; // Access parsed JSON body directly

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return {
        status: 400,
        body: { message: "Username already exists" },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      role,
    });

    await newUser.save();
    return {
      status: 200,
      body: { message: "User registered successfully" },
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: "Internal server error", error: err.message },
    };
  }
};

// Login an existing user
export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return ResJson("Invalid username or password", null, 401);

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return ResJson("Invalid username or password", null, 401);

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "20h",
  });
  
  return ResJson("Success",{roles: user.role, token: token},200)
};

// Forgot password - Generate token to reset password
export const forgotPassword = async (req, res) => {
  const { email } = await req.body;
  const user = await User.findOne({ email });
  if (!user)
    return {
      status: 404,
      body: { message: "Email not found!" },
    };

  const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "15m",
  });
  // Simulate sending email with the reset token (In practice, you'd send this via email)
  return {
    status: 200,
    message: "Password reset token generated",
    data: resetToken,
  };
  // res.send({ message: 'Password reset token generated', resetToken });
};

// Reset password
export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = await req.body;
  try {
    const decoded = jwt.verify(resetToken, JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    res.send({ message: "Password reset successful" });
    return { status: 200, message: "Password reset successful", data: null };
  } catch (err) {
    res.status(401).send({ message: "Invalid or expired reset token" });
    return {
      status: 401,
      message: "Invalid or expired reset token",
      data: null,
    };
  }
};
