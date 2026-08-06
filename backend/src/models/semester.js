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
            type: string,
            enum: {
                values: ['upcoming', 'active', 'completed'],
                message: 'Invalid semester status'
            },
            default: 'upcoming'
        },

        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide user'],
            unique: true
        }

    },
    {
        timestamps:true
    }
);



export default mongoose.model('Semester', SemesterSchema);