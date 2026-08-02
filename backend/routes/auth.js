import express from "express";
import { register } from "../controllers/auth.js";
import { registrationValidator } from "../validators/auth_validator.js";


const router = express.Router();

router.post('/register',registrationValidator,register);


export default router;