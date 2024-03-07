import { validationResult } from "express-validator";
import { HttpStatusCode } from "../const/statusCode.js";
import { serviceResponse } from "../libs/serviceResponse.js";

const validateResult = (req, res, next) => {
    try {
        validationResult(req).throw();
        return next();
    } catch (err) {
        res.status(HttpStatusCode.BAD_REQUEST).json(serviceResponse({ data: true, success: false, message: "Bad request", error: err.array() }));
    }
}

export { validateResult };
