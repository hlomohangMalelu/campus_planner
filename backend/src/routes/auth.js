import express from "express";
import { register ,login} from "../controllers/auth.js";
import { registrationValidator ,loginValidator } from "../validators/auth_validator.js";


const router = express.Router();

router.post('/register',registrationValidator,register);
router.post('/login', loginValidator, login);


export default router;