import {BadRequestError} from "../errors/errors.js";
import mongoose from "mongoose";

const validateSemesterDates = (startDateString , endDateString) => {
    
    const startDate = new Date(startDateString?.trim());
    const endDate = new Date(endDateString?.trim());

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new BadRequestError("Please provide valid dates");
    }

    const isEndDateValid = endDate > startDate;
    
    if(!isEndDateValid) {
        throw new BadRequestError('End date must be after start date');
    }

    return {
        startDate,
        endDate
    }
}

const validateDate = (dateString) => {
    const newDate = new Date(dateString?.trim());

    if (isNaN(newDate.getTime()) ) {
        throw new BadRequestError("Please provide a valid date");
    }

    return newDate;

}


const validateAcademicYear = (academicYear) => {
    academicYear = academicYear?.trim();

    const academicYearRegex = /^(\d{4}\/\d{4}|\d{4})$/;
    if(!academicYearRegex.test(academicYear)) {
        throw new BadRequestError('Academic year must be in the format YYYY/YYYY or YYYY');
    }
    
    const years = academicYear.split('/');
    if(years.length === 2) {
        const startYear = parseInt(years[0]);
        const endYear = parseInt(years[1]);

        if(endYear < startYear || startYear +1 !== endYear) {
            throw new BadRequestError('Please provide a valid academic year');
        } 
    }
    return academicYear;
}

const validateSemesterName = (name) => {
    name = name?.trim();

    if(name?.length < 2 ||name?.length > 50) {
        throw new BadRequestError('Please provide a valid semester name');
    }

    return name;
}


export const validateStatus = (status) => {
    status = status?.trim().toLowerCase();

    const validStatuses = ['upcoming', 'active', 'completed'];
    let isStatusValid = false;

    for(let i = 0; i < validStatuses.length; i++ ) {
        if(validStatuses[i] === status) {
            isStatusValid = true;
            break;
        }
    }

    if(!isStatusValid) {
        throw new BadRequestError('Please provide a valid status');
    }

    return status;
}


export const createSemesterValidator = (req, res , next) => {
    const {
        name , academicYear, startDate , endDate
    } = req.body;

    if(!name || !academicYear || !startDate || !endDate) {
        throw new BadRequestError('Please fill all fields');
    }

    const validatedName  = validateSemesterName(name);
    const validatedAcademicYear = validateAcademicYear(academicYear);

    const {
        startDate: validatedStartDate ,
        endDate: validatedEndDate
    } = validateSemesterDates(startDate, endDate);

    req.validatedData = {
        name: validatedName,
        academicYear: validatedAcademicYear,
        startDate: validatedStartDate,
        endDate: validatedEndDate
    };

    next();

}


export const mongooseIdValidator = (req , res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new BadRequestError('Invalid  ID');
    }

    next();
}


export const updateSemesterValidator = (req, res , next) => {
    const {
        name, academicYear, startDate, endDate
    } = req.body;

    const validatedData = {};

    if(!name && !academicYear && !startDate && !endDate && !status) {
        throw new BadRequestError('Please provide at least one field to update');
    }

    if(name) {
        validatedData.name =  validateSemesterName(name);
    }

    if(academicYear) {
        validatedData.academicYear = validateAcademicYear(academicYear);
    }

    if(startDate) {
        validatedData.startDate = validateDate(startDate);
    }

    if(endDate) {
        validatedData.endDate = validateDate(endDate);
    }


    req.validatedData = validatedData;

    next();

}