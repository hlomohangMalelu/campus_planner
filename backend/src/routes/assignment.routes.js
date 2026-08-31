import express from "express";
import * as assignmentValidators from "../validators/assignment.validators.js";
import * as assigmentController from "../controllers/assignment.controller.js";


const router = express.Router();

router.post('/', assignmentValidators.createAssignmentValidator,assigmentController.createAssignment);



export default router;
/*Postman Collection for Assignment Routes
POST /assignments
GET /assignments
    GET /assignments?courseId=...
    GET /assignments?status=pending
    GET /assignments?priority=high
    GET /assignments?courseId=...&status=pending
PATCH /assignments/:id
PATCH /assignments/:id/status
PATCH /assignments/:id/priority
DELETE /assignments/:id
*/

