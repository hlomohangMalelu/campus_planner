import assignmentModel from "../models/assignment.model.js";
import {findOwnerCourse} from "./course.service.js";
import * as CustomAPIError from "../errors/errors.js";

const validateDueDate = (dueDate) => {
    const today = Date.now();
    
    if(today > dueDate) {
        throw new CustomAPIError.BadRequestError("Due date must be after or today");
    }
}



export const createAssignment = async (userId, assignmentData) => {
    validateDueDate(assignmentData.dueDate);

    //check if user owns the course and throw error if not
    await findOwnerCourse(userId, assignmentData.courseId);

    //create new assignment
    const assignment = await assignmentModel.create({
        ...assignmentData,
        createdBy: userId
    });
    
    return assignment;
}

