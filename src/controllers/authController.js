// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { JWT_SECRET } from "../config.js";
import { ResJson } from "../utils/ResJson.js";
import { sendVerificationEmail } from "../services/emailService.js";
// Register a new user
export const register = async (req) => {
  try {
    const { username, password, email, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return ResJson("Username already exists", null, 400);
      }
      if (existingUser.email === email) {
        return ResJson("Email already exists", null, 400);
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      role,
      verified: false,
    });
    await newUser.save();

    // Send verification email
    await sendVerificationEmail(newUser);

    return ResJson(
      "User registered successfully. Please check your email to verify your account.",
      "",
      201
    );
  } catch (error) {
    console.log(error);
    return ResJson("Error creating user", null, 500);
  }
};

// Login an existing user
export const login = async (req) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return ResJson("User not found", "", 404);

  if (!user.verified) {
    return ResJson("Please verify your email before logging in", "", 403);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) return ResJson("Invalid credentials", "", 400);

  const expireDuration = process.env.expireDuration ?? 3
  // Generate JWT token
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: expireDuration+"h",
  });

  const expireIn = new Date(Date.now() + expireDuration * 60 * 60 * 1000).toISOString();
  return ResJson("Login successful", { token, role: user.role, expireIn}, 200);
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

export const verifyEmail = async (req) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    return ResJson("Invalid or expired token", "", 400);
  }

  // Mark user as verified
  user.verified = true;
  user.verificationToken = undefined;
  await user.save();

  return ResJson("Email verified successfully", "", 200);
};

export const sendVerificationToEmail = async (req) => {
  try {
    const { email } = req.body;

    if (!email) return ResJson("Please input email !", null, 400);

    const existingUser = await User.findOne({
      email,
    });

    if (!existingUser) {
      return ResJson("Email Not Found!", null, 404);
    }
    if (existingUser.verified) {
      return ResJson(
        "Email has been verified, no need to verify again",
        null,
        200
      );
    }
    await sendVerificationEmail(existingUser);
    return ResJson(
      "Verification token has been sent to your email, please check your email.",
      "",
      200
    );
  } catch (error) {
    console.log(error);
    return ResJson("Failed, Cannot send token !", null, 200);
  }
};
