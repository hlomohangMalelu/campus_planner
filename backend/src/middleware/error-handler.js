import CustomAPIError from "../errors/custom_api_error.js";

function handleError(err, res) {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // For unhandled errors, log the error and return a generic message
    console.error(err);
    return res.status(500).json({ error: "An unexpected error occurred." });
}


function errorHandlerMiddleware (err, req, res, next) { 
    handleError(err, res);
    
}

export default errorHandlerMiddleware;