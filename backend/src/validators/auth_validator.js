import BadRequestError from "../errors/bad_request.js";
import emailRegex from "../utils/email_regex.js";

export const registrationValidator = (req,res,next) => {
    let {
        firstName,
        lastName,
        email,
        password,
        confirmPassword
    } = req.body;
    
    firstName = firstName?.trim();
    lastName = lastName?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();
    confirmPassword = confirmPassword?.trim();

    if(!firstName|| !lastName || !email || !password || !confirmPassword ) {
        throw new BadRequestError('Please fill all fields');
    }

    if(lastName?.length < 3 || lastName?.length > 50) {
        throw new BadRequestError('Last name must be between 3 to 50 characters');
    }

    if(firstName?.length < 3 || firstName?.length > 50) {
        throw new BadRequestError('First name must be between 3 to 50 characters');
    }

    
    if(password !== confirmPassword) {
        throw new BadRequestError('Passwords do not match');
    }
    
    
    if(password?.length < 8) {
        throw new BadRequestError('Password must be at least 8 characters');
    }

    if(!emailRegex.test(email)) {
        throw new BadRequestError('Please enter a valid email');
    }

    //pass the valid credentials
    req.validatedData = {
        firstName,
        lastName,
        email,
        password
    }
    next();

}