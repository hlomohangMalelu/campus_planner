import mongoose from "mongoose";


const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide course name']
    },
    code: {
        type: String,
        required: [true, 'Please provide course code']
    },
    credits: {
        type: Number,
        required: [true , 'Please provide course credits'],
        min: [1, 'Course credits must be at least 1']
    },
    description: {
        type: String,
        maxLength: 300 
    },
    semesterId: {
        type: mongoose.Types.ObjectId,
        required: [true , 'Please provide semester Id'],
        ref: 'Semester'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: [true , 'Please provide user Id'],
        ref: 'User'
    }
},{timestamps: true});

CourseSchema.index({createdBy: 1, semesterId: 1, code: 1}, {unique: true});

CourseSchema.methods.toPublicCourse = function () {
    return {
        courseId: this._id,
        name: this.name,
        code: this.code,
        credits: this.credits,
        description: this.description,
        semesterId: this.semesterId,
    };
};


export default mongoose.model('Course', CourseSchema);