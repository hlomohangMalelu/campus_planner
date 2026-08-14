import * as courseService from "../services/course.service.js";
import { StatusCodes } from "http-status-codes";


export const createCourse = async (req, res) => {
    const {userId} =  req.user;

    const course = await courseService.createCourse(userId, req.validatedData);

    return res.status(StatusCodes.CREATED).json({
        success: true,
        course : course.toPublicCourse()
    });
}


export const getAllCourses = async (req, res) => {
    const {
        user: {userId}, 
        validatedData: {semesterId}
    } = req;

    const courses = await courseService.getAllCourses(userId, semesterId);

    return res.status(StatusCodes.OK).json({
        success: true,
        courses : courses.map((course) => course.toPublicCourse()),
        nbHits: courses.length
    });
}

