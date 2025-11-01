import { body, param, query, validationResult } from "express-validator";

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors
      .array()
      .map((err) => ({ field: err.path, message: err.msg }));

    throw new Error("Validation Error");
  };
};

export const commonValidations = {
  pagination: [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be a positive integer"),
  ],
  email: body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email address"),
  name: body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
};

export const validateSignUp = validate([
  commonValidations.email,
  commonValidations.name,
]);
