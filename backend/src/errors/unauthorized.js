import CustomAPIError from "./custom_api_error.js";
import { StatusCodes } from "http-status-codes";

class UnauthorizedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

export default UnauthorizedError;