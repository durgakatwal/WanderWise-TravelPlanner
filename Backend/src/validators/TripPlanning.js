import { body } from "express-validator";

export const createTripValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),

  body("startDate")
    .trim()
    .notEmpty()
    .withMessage("Start date is required")
    .isDate()
    .withMessage("Start Date must be a valid date"),

  body("endDate")
    .trim()
    .notEmpty()
    .withMessage("End date is required")
    .isDate()
    .withMessage("End date must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  body("destination")
    .isArray({ min: 1 })
    .withMessage("Destination must be a non-empty array")
    .custom((arr) => {
      if (!arr.every((dest) => typeof dest === "string")) {
        throw new Error("Each destination must be a string");
      }
      return true;
    }),

  // Budget validations
  body("budget.total")
    .notEmpty()
    .withMessage("Total budget is required")
    .isNumeric()
    .withMessage("Total budget must be a number"),

  body("budget.spent")
    .notEmpty()
    .withMessage("Spent budget is required")
    .isNumeric()
    .withMessage("Spent amount must be a number"),

  body("budget.expenses").optional().isArray(),

  body("budget.expenses.*.name")
    .notEmpty()
    .withMessage("Expense name is required"),

  body("budget.expenses.*.amount")
    .notEmpty()
    .withMessage("Expense amount is required")
    .isNumeric()
    .withMessage("Expense amount must be a number"),

  // Transport validations
  body("transport.mode")
    .trim()
    .notEmpty()
    .withMessage("Transport mode is required"),

  body("transport.details")
    .trim()
    .optional()
    .isString()
    .withMessage("Transport details must be a string"),

  // Accommodation validations
  body("accommodation.name")
    .trim()
    .notEmpty()
    .withMessage("Accommodation name is required"),

  body("accommodation.address")
    .trim()
    .notEmpty()
    .withMessage("Accommodation address is required"),

  body("accommodation.checkIn")
    .trim()
    .notEmpty()
    .withMessage("Check-in date is required")
    .isDate()
    .withMessage("Check-in must be a valid date"),

  body("accommodation.checkOut")
    .trim()
    .notEmpty()
    .withMessage("Check-out date is required")
    .isISO8601()
    .withMessage("Check-out must be a valid  date")
    .custom((value, { req }) => {
      const checkIn = new Date(req.body.accommodation.checkIn);
      const checkOut = new Date(value);
      if (checkOut <= checkIn) {
        throw new Error("Check-out must be after check-in");
      }
      return true;
    }),

  body("notes")
    .trim()
    .optional()
    .isString()
    .withMessage("Notes must be a string"),

  body("status")
    .optional()
    .isIn(["Draft", "Planned", "Ongoing", "Completed"])
    .withMessage("Status must be one of: Draft, Planned, Ongoing, Completed"),
];

export const inviteCollaboratorValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isArray()
    .withMessage("Email must be an array"),

  body("email.*")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email address"),
];
