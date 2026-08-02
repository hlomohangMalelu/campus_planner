import express from "express";
import { register ,login, getUser } from "../controllers/auth.js";
import { 
    registrationValidator ,
    loginValidator ,
} from "../validators/auth_validator.js";
import authorizeUser from "../middleware/auth.js";

const router = express.Router();

router.post('/register',registrationValidator,register);
router.post('/login', loginValidator, login);
router.get('/me',authorizeUser,getUser);

export default router;