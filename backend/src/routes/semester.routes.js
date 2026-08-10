import express from "express";
import * as semesterController from  "../controllers/semester.controller.js";
import * as semesterValidator from "../validators/semester.validators.js";

const router = express.Router();


router.post('/', semesterValidator.createSemesterValidator,semesterController.createSemester);
router.get('/', semesterController.getAllSemesters);
router.get('/:id', semesterValidator.mongooseIdValidator , semesterController.getSemester);
router.patch('/:id' ,[semesterValidator.mongooseIdValidator,semesterValidator.updateSemesterValidator],semesterController.updateSemester);
router.patch('/:id/activate',semesterValidator.updateSemesterStatusValidator , semesterController.updateSemesterStatus);
router.delete('/:id',semesterValidator.mongooseIdValidator,semesterController.deleteSemester);

export default router;