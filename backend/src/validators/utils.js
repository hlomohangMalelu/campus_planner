import {BadRequestError } from "../errors/errors.js"
import {isEmailValid}from "../utils/email_regex.js";


// name -> "First name" or "Last name"
export const validateName = (value ,name ) => {
    if(!value) return undefined;

    value = value?.trim();

    if(value?.length < 3 || value?.length > 50) {
        throw new BadRequestError(`${name} must be between 3 to 50 characters`);
    }
    
    return value;
}


export const validateEmail = (email) => {

    if(!email) return undefined;
    email = email?.trim().toLowerCase();

    if(!isEmailValid(email)) {
        throw new BadRequestError('Please enter a valid email');
    }

    return email;
}


export const validateNewPassword = (password , confirmPassword) => {
    if(!password || !confirmPassword) return;
    if(password?.trim().length === 0) {
        throw new BadRequestError('Password cannot be empty or contain only spaces');
    }

    if(password !== confirmPassword) {
        throw new BadRequestError('Passwords do not match');
    }
    
    
    if(password?.length < 8) {
        throw new BadRequestError('Password must be at least 8 characters');
    }

    return password;
}