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


export const getAllCourses = async (userId, semesterId) => {
    const queryObject = {
        createdBy: userId
    };

    if(semesterId) {
        //check if user owns the semester and throw error if not
        await findOwnerSemester(userId, semesterId); 
        //add semesterId to query object
        queryObject.semesterId = semesterId;
    }

    //find all courses for the user and semester if provided, sorted by code
    const courses = await Course.find(queryObject).sort('code');

    return courses; 
}    

export const findOwnerCourse = async (userId, courseId) => {
    const course = await Course.findOne({
        _id: courseId,
        createdBy: userId
    });

    if(!course) {
        throw new CustomAPIError.NotFoundError('Course not found');
    }

    return course;

}

export const getCourse = async (userId, courseId) => {
    
    return await findOwnerCourse(userId, courseId);

}


export const updateCourse = async (userId, courseData) => {
    const {courseId, ...updateData} = courseData;
    
    const courseToUpdate = await findOwnerCourse(userId, courseId);

    if(Object.hasOwn(updateData, 'code')) {
        const existingCourse = await Course.findOne({
            createdBy: userId,
            semesterId: courseToUpdate.semesterId,
            code,
            _id: {$ne: courseId}
        });

        if(existingCourse) {
            throw new CustomAPIError.ConflictError(`Course with code '${code}' already exists for this semester`);
        }
    }

    Object.assign(courseToUpdate, updateData);

    await courseToUpdate.save();

    return courseToUpdate;
    
}


export const deleteCourse = async (userId, courseId) => {

    const course = await findOwnerCourse(userId, courseId);

    //delete all data owned by course

    await Course.deleteOne({
        _id: course._id
    });

    return;
}