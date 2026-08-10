import Semester from "../models/semester.model.js";
import * as CustomAPIError from "../errors/errors.js";
import { validateSemesterDates } from "../validators/semester.validators.js";

export const createSemester = async (semesterData) => {
    const {name , academicYear, createdBy } = semesterData;

    const existingSemester = await Semester.findOne({createdBy, academicYear, name});

    if(existingSemester) {
        throw new CustomAPIError.ConflictError(`${name} already used for academic year ${academicYear}`)
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


export const updateSemester = async (userId, semesterId, updateData) => {

    const semesterToUpdate = await findOwnerSemester(userId, semesterId);

    const name = updateData.name ?? semesterToUpdate.name;
    const academicYear = updateData.academicYear ?? semesterToUpdate.academicYear;

    const existingSemester = await Semester.findOne({
        createdBy: userId,
        academicYear,
        name,
        _id: {$ne:semesterId}
    });

    if (existingSemester) {
        throw new CustomAPIError.ConflictError(
            `A semester with this name already exists for academic year ${updateData.academicYear ?? semesterToUpdate.academicYear}`
        );
    }

    const startDate = updateData.startDate ?? semesterToUpdate.startDate;
    const endDate = updateData.endDate ?? semesterToUpdate.endDate;

    validateSemesterDates(startDate, endDate);

    Object.assign(semesterToUpdate , updateData);

    await semesterToUpdate.save();

    return semesterToUpdate;
}