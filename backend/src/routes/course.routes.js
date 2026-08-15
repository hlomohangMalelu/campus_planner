import express from "express";
import * as courseValidator from "../validators/course.validators.js";
import * as courseController from "../controllers/course.controller.js";

const router = express.Router();

router.post('/',courseValidator.createCourseValidator, courseController.createCourse);
router.get('/',courseValidator.getAllCoursesValidator, courseController.getAllCourses);
router.get('/:id', courseValidator.courseIdValidator ,courseController.getCourse);
router.patch('/:id', courseValidator.updateCourseValidator, courseController.updateCourse);
router.delete('/:id', courseValidator.courseIdValidator, courseController.deleteCourse);

export default router;