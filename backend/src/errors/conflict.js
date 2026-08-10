import CustomAPIError from "./custom_api_error.js";

class ConflictError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = 409; // HTTP status code for conflict
    }
}

export default ConflictError;