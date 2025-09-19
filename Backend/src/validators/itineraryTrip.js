import { body, param } from "express-validator";

export const createItineraryValidator = [
  param("tripId")
    .trim()
    .notEmpty()
    .withMessage("Trip is required")
    .isMongoId()
    .withMessage("Trip must be in valid MongoDB ID"),

  body("title").trim().notEmpty().withMessage("Title is required"),

  body("description").trim().optional(),

  body("date")
    .trim()
    .notEmpty()
    .withMessage("Date is required")
    .isDate()
    .withMessage("Date must be a valid date"),

  body("activities").isArray().withMessage("Activities must be in an array"),

  body("activities.*.name")
    .trim()
    .notEmpty()
    .withMessage("Activity name is required"),

  body("activities.*.time")
    .trim()
    .notEmpty()
    .withMessage("Activity time is required"),

  body("activities.*.notes")
    .trim()
    .isArray()
    .withMessage("Note must be an array"),

  body("activities.*.notes.*")
    .trim()
    .notEmpty()
    .withMessage("Note is required"),
];
