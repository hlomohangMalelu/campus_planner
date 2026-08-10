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

export const getSemester = async (req, res) => {
    const {
        user : {userId},
        params : {id : semesterId}
    } = req;

    const semester = await semesterService.getSemester(userId, semesterId);

    return res.status(StatusCodes.OK).json({
        success: true,
        semester: semester.toPublicSemester()
    });
}


export const updateSemester = async (req , res) => {
    const {
        user : {userId},
        params : {id : semesterId}
    } = req;

    const semester = await semesterService.updateSemester(userId, semesterId, req.validatedData);

    return res.status(StatusCodes.OK).json({
        success: true,
        semester: semester.toPublicSemester()
    });
}

export const updateSemesterStatus = async (req, res) => {
    const {
        user : {userId},
        params : {id : semesterId}
    } = req;

    const result = await semesterService.updateSemesterStatus(userId, semesterId, req.validatedData);

    return res.status(StatusCodes.OK).json({
        success: true,
        ...result
    });
}