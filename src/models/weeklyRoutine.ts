import mongoose, { Document, Schema } from "mongoose";

export interface IWeeklyRoutine extends Document {
  title: string;
  description?: string;
  dayOfWeek:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  timeOfDay: string; //Formato 24 horas;
  user: mongoose.Types.ObjectId; 
  isActive: boolean;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WeeKlyRoutineSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    dayOfWeek: {
      type: String,
      required: true,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
    },
    timeOfDay: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Formato HH:MM
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      trim: true,
      maxLength: 50,
    },
  },
  {
    timestamps: true,
  }
);


WeeKlyRoutineSchema.index({user:1 , dayOfWeek: 1, timeOfDay: 1});
export default mongoose.model<IWeeklyRoutine>("WeeklyRoutine", WeeKlyRoutineSchema)
