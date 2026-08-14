import { StatusCodes } from "http-status-codes"


export const createCourse = (req, res) => {
    res.status(StatusCodes.CREATED).json(req.validatedData);
}