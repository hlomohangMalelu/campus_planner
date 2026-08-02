import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import emailRegex from "../utils/email_regex.js";
import jwt from "jsonwebtoken";
import _default from "zod/v4/locales/az.cjs";

const UserSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required:[true, 'Please provide name'],
        trim:true,
        minlength:3,
        maxlength:50
    },
    lastName: {
        type:String,
        required:[true, 'Please provide last name'],
        trim:true,
        minlength:3,
        maxlength:50
    },
    email: {
        type:String,
        required:[true,'Please provide an email'],
        trim:true,
        unique:true,
        lowercase:true,
        match:[
            emailRegex,
            'Please provide a valid email'
        ]
    },
    password: {
        type:String,
        required:[true, 'Please provide a password'],
        minlength:8,
        select:false
    },
    role:{
        type:String,
        required:[true,'Please provide a role'],
        default:'student',
        enum: {
            values:['student','admin'],
            message:'Please provide a valid role'
        }
    }

    },
    {
        timestamps:true
    }
);

UserSchema.pre('save', async function () {
    if(!this.isModified('password')) return;
    
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password,salt);
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword , this.password);

}


UserSchema.methods.createJWT = function () {
    return jwt.sign(
        {userId:this._id,role:this.role},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_LIFETIME}
    );
}

UserSchema.methods.toPublicProfile = function () {
    return {
        userId:this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email
    }
}


export default mongoose.model('User',UserSchema);