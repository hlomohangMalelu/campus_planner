import "dotenv/config";
import User from "../models/User.js";
import BadRequestError from "../errors/bad_request.js";
import UnauthorizedError from "../errors/unauthorized.js";
import { StatusCodes } from "http-status-codes";

export const register = async (req, res) => {

    const {email , password , firstName , lastName} = req.validatedData;
    const existingUser = await User.findOne({email});

    if(existingUser) {
        throw new BadRequestError('An account with this email already exists.');
    }

    const user = await User.create(req.validatedData);
    
    res.status(StatusCodes.CREATED).json({success:true,message:'Account created successfully'});
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

    res.status(StatusCodes.OK).json({
        success:true,
        user:user.toPublicProfile(),
        token
    });
}