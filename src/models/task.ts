import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  user: mongoose.Types.ObjectId;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: "Due date must be in the future",
      },
    },
  },
  {
    timestamps: true,
  }
);

//Index para mejorar queries por usuario
TaskSchema.index({ user: 1, status: 1 });

TaskSchema.pre("save", function (next) {
  if (this.status === "completed") {
    this.completed = true;
  } else {
    this.completed = false;
  }
  next();
});

export default mongoose.model<ITask>("Task", TaskSchema);
