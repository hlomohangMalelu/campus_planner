import {BadRequestError} from "../errors/errors.js";
import { validateName, validateMongooseId } from "./utils.js";

const validateCode = (code) => {
    code = code?.trim().toUpperCase();

    if(code?.length < 3 || code?.length > 20) {
        throw new BadRequestError('Course code must be between 3 to 20 characters');
    }

    return code;
}


const validateCredits = (credits) => {
    const parsedCredits = Number(credits);

    if(!Number.isFinite(parsedCredits)) {
        throw new BadRequestError('Please provide a valid value for credits');
    }

    if(parsedCredits < 1) {
        throw new BadRequestError('Credits must be greater than or equal to 1');
    }

    return parsedCredits;
}


const validateDescription = (description) => {
    description = description?.trim();

    if(description?.length > 300) {
        throw new BadRequestError('Description must be atmost 300 characters ');
    }

    return description;
}

export const createCourseValidator = (req, res, next) => {
    const {
        name, code, credits,
        semesterId, description
    } = req.body;

    const validatedData = {};

    if(!name?.trim() || !code?.trim()  || !credits || !semesterId?.trim() ) {
        throw new BadRequestError('Please provide all the required fields');
    }

    validatedData.semesterId = validateMongooseId(semesterId.trim() , 'Semester');
    validatedData.name = validateName(name, 'Course name');
    validatedData.code = validateCode(code);
    validatedData.credits = validateCredits(credits);

    if(description?.trim()) {
        validatedData.description = validateDescription(description);
    }

    req.validatedData = validatedData;

    next();
}


export const getAllCoursesValidator = (req, res, next) => {
    const {semesterId} = req.query;

    if(semesterId?.trim()) {
        req.validatedData = {
            semesterId : validateMongooseId(semesterId, 'Semester')
        }
    }
    else {
        req.validatedData = {
            semesterId: null
        }
    }

    next();
}


export const courseIdValidator = (req, res, next) => {
    const {id} = req.params;

    req.validatedData = {
        courseId: validateMongooseId(id, 'Course')
    }
    
    next();
}


export const updateCourseValidator = (req, res, next) => {
    const {id} = req.params;
    const {name, code, credits, description} = req.body;
    const validatedData = {
        courseId: validateMongooseId(id, 'Course')
    };

    const hasDescription = Object.hasOwn(req.body, 'description');
    const hasCredits = Object.hasOwn(req.body, 'credits');

    if(
        !name?.trim() && 
        !code?.trim() && 
        !credits && 
        !hasDescription
    ) {
        throw new BadRequestError('Please provide at least one field to update');
    }

    if(name) validatedData.name = validateName(name, 'Course');
    
    if(code) validatedData.code = validateCode(code);

    if(hasCredits) validatedData.credits = validateCredits(credits);

    if(hasDescription) validatedData.description = validateDescription(description);

    req.validatedData = validatedData;

    next();
    
}