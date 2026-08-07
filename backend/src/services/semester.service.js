import Semester from "../models/semester.model.js";
import * as CustomAPIError from "../errors/errors.js";

export const createSemester = async (semesterData) => {
    const {name , academicYear, createdBy } = semesterData;

    const existingSemester = await Semester.findOne({createdBy, academicYear, name});

    if(existingSemester) {
        throw new CustomAPIError.BadRequestError(`${name} already used for academic year ${academicYear}`)
    }

    const newSemester = await Semester.create(semesterData);

    return newSemester;
}