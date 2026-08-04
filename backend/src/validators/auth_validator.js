import BadRequestError from "../errors/bad_request.js";
import UnauthorizedError from "../errors/unauthorized.js"
import {isEmailValid}from "../utils/email_regex.js";
import { validateEmail, validateName ,validatePassword} from "./utils.js";

export const registrationValidator = (req,res,next) => {
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword
    } = req.body;
    

    if(!firstName|| !lastName || !email || !password || !confirmPassword ) {
        throw new BadRequestError('Please fill all fields');
    }

    const validatedNewPassword = validatePassword(password,confirmPassword);
    const validatedFirstName = validateName(firstName,'First name');
    const validatedLastName = validateName(lastName,'Last name');
    const validatedEmail = validateEmail(email);

    //pass the valid credentials
    req.validatedData = {
        firstName:validatedFirstName,
        lastName:validatedLastName,
        email:validatedEmail,
        password:validatedNewPassword
    }
    next();

}


export const loginValidator =  (req, res, next) => {
    const {email,password} = req.body;

    if(!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    const validatedEmail = validateEmail(email);


    req.validatedData = {
        email:validatedEmail,
        password
    }

    next();
    
}


export const updateProfileValidator = (req,res,next) => {
    const {
        firstName,
        lastName,
        email
    } = req.body;

    if(!firstName && !lastName && !email) {
        throw new BadRequestError('Please provide at least one field to update');
    }

    const validatedFirstName = validateName(firstName,'First name');
    const validatedLastName = validateName(lastName,'Last name');
    const validatedEmail = validateEmail(email);

    const validatedData = {};

    if(validatedFirstName) {
        validatedData.firstName = validatedFirstName;
    }

    if(validatedLastName) {
        validatedData.lastName = validatedLastName;
    }

    if(validatedEmail) {
        validatedData.email = validatedEmail;
    }

    req.validatedData = validatedData;

    next();
}


export const changePasswordValidator = (req,res,next) => {
    const {
        oldPassword,
        newPassword,
        confirmNewPassword,
    } = req.body;

    if(!oldPassword || !newPassword || !confirmNewPassword) {
        throw new BadRequestError('Please fill all fields');
    }

    validatePassword(newPassword,confirmNewPassword);

    req.validatedData = {
        oldPassword,
        newPassword
    };

    next();

}