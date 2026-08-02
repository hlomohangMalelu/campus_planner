import mongoose from "mongoose";

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
    username: {
        type:String,
        required:[true, 'Please provide username'],
        trim:true,
        unique:true,
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
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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