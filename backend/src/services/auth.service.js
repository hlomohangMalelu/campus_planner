import User from "../models/User.js";
import {
    NotFoundError ,
    BadRequestError , 
    UnauthorizedError
} from "../errors/errors.js";

export const register = async (userData) => {

    const existingUser = await User.findOne({
        email: userData.email
    });

    if(existingUser) {
        throw new BadRequestError('An account with this email already exists.');
    }

    const user = await User.create(userData);

    const token = user.createJWT();

    return {
        token,
        user: user.toPublicProfile(),
        message: 'Account created successfully'
    };

}


export const login = async (userData) => {
    const {email , password} = userData;

    const user = await User.findOne({email}).select('+password');

    if(!user) {
        throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect) {
        throw new UnauthorizedError('Invalid email or password');
    }

    const token = user.createJWT();

    return {
        token,
        user: user.toPublicProfile()
    };
}


export const getUser = async (userId) => {
    const user = await User.findById(userId);

    if(!user) {
        throw new UnauthorizedError('Authentication invalid');
    }

    return {
        user: user.toPublicProfile()
    };
}


export const updateProfile = async (userId , userData) => {
    const {email } = userData;

    if(email) {
        const existingUser = await User.findOne({email});
        if(existingUser) {
            
            if((existingUser._id).toString() !== userId) {
                throw new BadRequestError('Email already taken');
            }
        }
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new UnauthorizedError('Authentication invalid');
    }
    
    Object.assign(user, userData);

    await user.save();

    return {
        user: user.toPublicProfile()
    };
} 


export const changePassword = async (userId , userData) => {
    const { oldPassword , newPassword } = userData

    const user = await User.findById(userId).select('+password');

        if (!user) {
        throw new UnauthorizedError('Authentication invalid');
    }

    const isOldPasswordCorrect = await user.comparePassword(oldPassword);

    if(!isOldPasswordCorrect) {
        throw new UnauthorizedError('Current password is incorrect');
    }

    const isNewPasswordEqualOld = await user.comparePassword(newPassword);

    if(isNewPasswordEqualOld) {
        throw new BadRequestError('New password cannot be the same as the current password');
    }

    user.password = newPassword;

    await user.save();

    return {
        message: 'Password changed successfully'
    };
}