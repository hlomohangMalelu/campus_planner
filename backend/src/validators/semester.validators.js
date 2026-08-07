import BadRequestError from "../errors/bad_request.js";
import mongoose from "mongoose";

const validateSemesterDates = (startDateString , endDateString) => {
    
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

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

const validateAcademicYear = (academicYear) => {
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
    if(name?.length < 2 ||name?.length > 50) {
        throw new BadRequestError('Please provide a valid semester name');
    }

    return name;
}




export const createSemesterValidator = (req, res , next) => {
    let {
        name , academicYear, startDate , endDate
    } = req.body;

    name = name?.trim();
    academicYear = academicYear?.trim();

    if(!name || !academicYear || !startDate || !endDate) {
        throw new BadRequestError('Please fill all fields');
    }

    name = validateSemesterName(name);
    academicYear = validateAcademicYear(academicYear);

    const {
        startDate: validatedStartDate ,
        endDate: validatedEndDate
    } = validateSemesterDates(startDate, endDate);

    

    req.validatedData = {
        name,
        academicYear,
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