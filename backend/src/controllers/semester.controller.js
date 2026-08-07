import * as semesterService from "../services/semester.service.js";
import { StatusCodes } from "http-status-codes";

export const createSemester = async (req, res ) => {
    
    const {userId} = req.user;

    const semester = await semesterService.createSemester({
        createdBy: userId,
        ...req.validatedData
    });

    return res.status(StatusCodes.CREATED).json({
        success:true, 
        semester: semester.toPublicSemester()
    });
}


export const getAllSemesters = async (req,res) => {
    const {userId} = req.user;

    const semesters = await semesterService.getAllSemesters(userId);

    return res.status(StatusCodes.OK).json({
        success: true,
        semesters : semesters.map((semester) => semester.toPublicSemester()),
        nbHits: semesters.length
    });
}