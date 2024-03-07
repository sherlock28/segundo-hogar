import { check } from "express-validator";
import { validateResult } from "../helpers/validateHelper.js";

const validateStudentData = [
    check('file_number')
        .exists().withMessage("file_number is required")
        .notEmpty().withMessage("file_number cannot be empty")
        .isNumeric().withMessage("file_number must be numeric"),

    (req, res, next) => validateResult(req, res, next)
];

export { validateStudentData };
