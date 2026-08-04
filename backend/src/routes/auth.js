import express from "express";
import { 
    register ,login, getCurrentUser , 
    updateUserProfile 
} from "../controllers/auth.js";
import { 
    registrationValidator ,
    loginValidator ,
    updateProfileValidator
} from "../validators/auth_validator.js";
import authorizeUser from "../middleware/auth.js";

const router = express.Router();

router.post('/register',registrationValidator,register);
router.post('/login', loginValidator, login);
router.get('/me',authorizeUser,getCurrentUser);
router.patch('/profile',[authorizeUser,updateProfileValidator],updateUserProfile);

export default router;