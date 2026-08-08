import mongoose from "mongoose";

const SemesterSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide semester name'],
            //eg semester A /semester B or Semester 1 /semester 2
        },
        academicYear : {
            type: String,
            required: [true , 'Please provide an academic year'],
            //eg 2026/2027 or 2026
        },
        startDate: {
            type: Date,
            required:[true, 'Please provide start date']

        },
        endDate: {
            type: Date,
            required:[true, 'Please provide end date']
        },
        status: {
            type: String,
            enum: {
                values: ['upcoming', 'active', 'completed'],
                message: 'Invalid semester status'
            },
            default: 'upcoming'
        },

        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide user']
        }

    },
    {
        timestamps:true
    }
);

SemesterSchema.index({ name: 1, academicYear: 1, createdBy: 1 }, { unique: true });

SemesterSchema.methods.toPublicSemester = function () {
    return {
        semesterId: this._id.toString(),
        name: this.name,
        academicYear: this.academicYear,
        startDate: this.startDate,
        endDate: this.endDate,
        status: this.status,
    };
}


SemesterSchema.pre('save', function () {
    if(!(this.endDate > this.startDate)) {
        throw new BadRequestError('End date must be after start date');
    }
})



export default mongoose.model('Semester', SemesterSchema);