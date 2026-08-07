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


export const getAllSemesters = async (userId) => {

    const semesters = await Semester.find({createdBy: userId}).sort('-academicYear startDate');

    if(!semesters || semesters.length === 0) {
        return [];
    }

    return semesters;

}


const findOwnerSemester = async (userId, semesterId) => {
    const semester = await Semester.findOne({
        createdBy: userId, _id: semesterId
    });

    if(!semester) {
        throw new CustomAPIError.NotFoundError(`No semester found with id: ${semesterId}`);
    }

    return semester;
}


export const getSemester = async (userId, semesterId) => {

    return await findOwnerSemester(userId, semesterId);
}