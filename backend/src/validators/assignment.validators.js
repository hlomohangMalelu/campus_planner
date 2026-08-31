import {BadRequestError} from "../errors/errors.js";
import { validateDescription, validateMongooseId, validateDate } from "./utils.js";

const validateTitle = (title) => {
    title = title?.trim();

    if(title.length < 5 || title.length > 100) {
        throw new BadRequestError("Title must be between 5 and 100 characters");
    }

    return title;
}

export const createAssignmentValidator = (req, res, next) => {
    const {
        title,
        description,
        dueDate,
        courseId
    } = req.body;

    const validatedData = {};

    if(!title?.trim() || !dueDate?.trim() || !courseId?.trim) {
        throw new BadRequestError("Please provide all required fields");
    }

    validatedData.title = validateTitle(title);
    validatedData.dueDate = validateDate(dueDate);
    validatedData.courseId = validateMongooseId(courseId);

    if(description?.trim()) {
        validatedData.description = validateDescription(description);
    }

    req.validatedData = validatedData;

    next();

}