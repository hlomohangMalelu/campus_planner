import express from "express";
import * as semesterController from  "../controllers/semester.controller.js";
import * as semesterValidator from "../validators/semester.validators.js";

const router = express.Router();


router.post('/', semesterValidator.createSemesterValidator,semesterController.createSemester);
router.get('/', semesterController.getAllSemesters);
router.get('/:id', semesterValidator.mongooseIdValidator , semesterController.getSemester);

export default router;