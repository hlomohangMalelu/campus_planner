import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide assignment title"],
    trim: true,
    maxlength: [100, "Assignment title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Assignment description cannot be more than 500 characters"],
  },
  dueDate: {
    type: Date,
    required: [true, "Please provide assignment due date"],
  },
  status: {
    type: String,
    enum: ["pending", "completed", "overdue"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
    required: [true, "Please provide course ID"],
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user ID"],
  },
}, { timestamps: true });


AssignmentSchema.methods.toPublicAssignment = function () {
  return {
    assignmentId: this._id,
    title: this.title,
    description: this.description,
    dueDate: this.dueDate,
    status: this.status,
    priority: this.priority,
    courseId: this.courseId
  };
}

export default mongoose.model("Assignment", AssignmentSchema);
