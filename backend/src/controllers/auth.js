import * as authService from "../services/auth.service.js";
import { StatusCodes } from "http-status-codes";


export const register = async (req, res) => {

   const result = await authService.register(req.validatedData);
    
    return res.status(StatusCodes.CREATED).json({
        success: true,
        ...result
    });
}


export const login = async (req , res) => {

    const result = await authService.login(req.validatedData);

    return res.status(StatusCodes.OK).json({
        success:true,
        ...result
    });
}


export const getCurrentUser = async (req ,res) => {
    const {userId} = req.user;

    const result = await authService.getUser(userId);

    return res.status(StatusCodes.OK).json({
        success:true,
        ...result
    });
}

export const updateUserProfile = async (req,res) => {
    const {userId} = req.user;

    const result = await authService.updateProfile(userId, req.validatedData);

    return res.status(StatusCodes.OK).json({
        success:true,
        ...result
    });
}


export const changePassword = async (req,res) => {
    const { userId } = req.user;

    const result = await authService.changePassword(userId, req.validatedData);

    return res.status(StatusCodes.OK).json({
        success:true,
        ...result
    });
    
}


export const logout = async (req, res) => {
    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Logged out successfully'
    });
}