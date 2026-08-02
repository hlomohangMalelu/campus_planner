import mongoose from "mongoose";
import emailRegex from "../utils/email_regex.js";

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
    }

    },
    {
        timestamps:true
    }
);


export default mongoose.model('User',UserSchema);