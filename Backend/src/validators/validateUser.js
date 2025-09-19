import { body } from "express-validator";
import User from "../models/user.js";

export const createUserValidator = [
  // name validation
  body("name").trim().notEmpty().withMessage("Name is required"),

  // email validation
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error("Email is already in use");
      }
      return true;
    }),

  //we can also use the unique to check if the email is existed already

  // password validation
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Za-z]/)
    .withMessage("Password must contain at least one letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*#?&]/)
    .withMessage("Password must contain at least one special character"),
];

export const loginUserValidator = [
  // email validation
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  // password validation
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Za-z]/)
    .withMessage("Password must contain at least one letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*#?&]/)
    .withMessage("Password must contain at least one special character"),
];

export const updateProfileValidator = [
  body("bio").optional().isString().withMessage("Bio must be string"),

  body("preferences")
    .optional()
    .isArray()
    .withMessage("preferences must be an array of string"),
];

export const updateAvatarValidator = [
  body("avatar")
    .notEmpty()
    .withMessage("Avatar is required")
    .isURL()
    .withMessage("Avatar must be a valid URL"),
];
