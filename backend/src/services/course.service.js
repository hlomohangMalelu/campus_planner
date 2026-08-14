import Course from "../models/course.model.js";
import * as CustomAPIError from "../errors/errors.js";
import {findOwnerSemester} from "./semester.service.js";

export const createCourse = async (userId, courseData) => {
    const {semesterId, code} = courseData;

    //find user semester and throw error if not found
    await findOwnerSemester(userId, semesterId); 

    //check if course already exists for the user and semester
    const existingCourse = await Course.findOne({
        createdBy: userId, semesterId , code
    });

    if(existingCourse) {
        throw new CustomAPIError.ConflictError('Course already exists for this semester');
    }

    //create new course
    const course = await Course.create({
        ...courseData,
        createdBy: userId
    });

    return course;

}