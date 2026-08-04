import express from "express";
import { 
    register ,login, getCurrentUser , 
    updateUserProfile, changePassword,
    logout
} from "../controllers/auth.js";
import { 
    registrationValidator ,loginValidator ,
    updateProfileValidator,changePasswordValidator
} from "../validators/auth_validator.js";
import authorizeUser from "../middleware/auth.js";

const router = express.Router();

router.post('/register', registrationValidator, register);
router.post('/login', loginValidator, login);
router.post('/logout', authorizeUser, logout);
router.get('/me', authorizeUser, getCurrentUser);
router.patch('/profile', [authorizeUser, updateProfileValidator], updateUserProfile);
router.patch('/change-password', [authorizeUser ,changePasswordValidator], changePassword);

export default router;