import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { createUser } from "./user.js";
import { compare } from "bcrypt";
import User from "../models/user.js";

const generateToken = asyncHandler(async (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
});
const register = asyncHandler(async (req, res) => {
  const user = await createUser(req.body);
  const token = await generateToken(user._id);
  res.status(201).json({ token });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordCorrect = await compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials");
  }
  const token = await generateToken(user._id);
  res.status(200).json({ token });
});
export { generateToken, register, login };
