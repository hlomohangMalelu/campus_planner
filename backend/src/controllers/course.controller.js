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


