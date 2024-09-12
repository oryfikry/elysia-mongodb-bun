import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { User } from '../models/userModel';

// Function to generate random token
export const generateToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Function to send verification email
export const sendVerificationEmail = async (user) => {
  const verificationToken = generateToken();

  // Update user with token
  user.verificationToken = verificationToken;
  await user.save();

  const verificationUrl = `${process.env.APP_URL}/verify-email/${verificationToken}`;

  // Set up nodemailer transport
  const transporter = nodemailer.createTransport({
    service:'Gmail',
    host:'smtp.gmail.com',
    port:465,
    auth: {
      user: process.env.EMAIL_USER,  // Your email
      pass: process.env.EMAIL_PASS,  // Your email password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: user.email,
    subject: 'Verify your email',
    html: `Please click the link to verify your account: <a href="${verificationUrl}">Verify Email</a>`,
  };
  // console.log(verificationUrl);
  // Send the email
  await transporter.sendMail(mailOptions);
};
