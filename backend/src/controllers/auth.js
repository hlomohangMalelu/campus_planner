import "dotenv/config";
import User from "../models/User.js";
import {
    NotFoundError ,
    BadRequestError , 
    UnauthorizedError
} from "../errors/errors.js"
import { StatusCodes } from "http-status-codes";

export const register = async (req, res) => {

    const {email , password , firstName , lastName} = req.validatedData;
    const existingUser = await User.findOne({email});

    if(existingUser) {
        throw new BadRequestError('An account with this email already exists.');
    }

    const user = await User.create(req.validatedData);
    
    return res.status(StatusCodes.CREATED).json({success:true,message:'Account created successfully'});
}


export const login = async (req , res) => {

    const {email , password} = req.validatedData;

    const user = await User.findOne({email}).select('+password');

    if(!user) {
        throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect) {
        throw new UnauthorizedError('Invalid email or password');
    }

    const token = user.createJWT();

    return res.status(StatusCodes.OK).json({
        success:true,
        user:user.toPublicProfile(),
        token
    });
}


export const getUser = async (req ,res) => {
    const {userId} = req.user;

    const user = await User.findById(userId);

    if(!user) {
        throw new UnauthorizedError("Authentication invalid");
    }

    return res.json({
        user: user.toPublicProfile()
    });
}