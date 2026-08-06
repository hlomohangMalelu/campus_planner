import BadRequestError from "../errors/bad_request.js";

export const validateSemesterDates = (startDate , endDate) => {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    const isEndDateValid = endDate > startDate;
    const dateString = new Date(endDate);
    
    if(!isEndDateValid) {
        throw new BadRequestError('End date must be after start date');
    }

    return {
        validatedStartDate,
        validatedEndDate
    }
}

