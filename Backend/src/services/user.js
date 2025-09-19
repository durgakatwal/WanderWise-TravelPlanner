import User from "../models/user.js";
import asyncHandler from "express-async-handler";
//use for password hashed
import bcrypt from "bcrypt";

const createUser = asyncHandler(async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("Email is already in use");
  }
  userData.password = await bcrypt.hash(userData.password, 10);
  return await User.create(userData);
});

const create = asyncHandler(async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

const findById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const usersById = await User.findById(id);
  if (!usersById) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.status(200).json(usersById);
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updateusers = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      ...(req.body.completed && {
        completed: req.body.completed,
      }),
    },
    { new: true }
  );
  if (!updateusers) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.status(200).json(updateusers);
});

//letting try ... catch... beig used just for knowing about the try catch
const remove = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const removeUser = await User.findByIdAndDelete(id);
    if (!removeUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(removeUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// services/user.js
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No user ID" });
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

// services/user.js

const updateProfile = asyncHandler(async (req, res) => {
  const { bio, preferences } = req.body;

  // Optional: Validate input
  if (!bio && !preferences) {
    return res.status(400).json({ message: "No valid fields to update" });
  }

  const updates = {};
  if (bio !== undefined) updates.bio = bio;
  if (preferences !== undefined) updates.preferences = preferences;

  const user = await User.findByIdAndUpdate(
    req.user?.userId || req.user?._id,
    updates,
    {
      new: true, // Return updated doc
      runValidators: true, // Ensure Mongoose validators run
    }
  ).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

const updateAvatar = asyncHandler(async (req, res) => {
  const { avatar } = req.body;

  if (!avatar) {
    return res.status(400).json({ message: "Avatar URL is required" });
  }

  const user = await User.findByIdAndUpdate(
    req.user?.userId || req.user?._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});
export {
  create,
  createUser,
  getUsers,
  findById,
  update,
  remove,
  getProfile,
  updateProfile,
  updateAvatar,
};
