import * as semesterService from "../services/semester.service.js";
import { StatusCodes } from "http-status-codes";

export const createSemester = async (req, res ) => {
    
    const {userId} = req.user;

    const semester = await semesterService.createSemester({
        createdBy: userId,
        ...req.validatedData
    });

    return res.status(StatusCodes.CREATED).json(semester.toPublicSemester());
}