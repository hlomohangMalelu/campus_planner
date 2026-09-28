import * as assignmentService from "../services/assignment.service.js";


export const createAssignment = async (req, res) => {
    const {userId} = req.user;

    const assignment = await assignmentService.createAssignment(
        userId, 
        req.validatedData
    );

    return res.json({
        success: true,
        assignment: assignment.toPublicAssignment()
    });
}