import WeeklyRoutine from "../models/weeklyRoutine";
import { AppError } from "../middlewares/errorHandler";
import mongoose from "mongoose";
import {
  CreateWeeklyRoutineDto,
  UpdateWeeklyRoutineDto,
  GetWeeklyRoutinesQuery,
} from "../schemas/weeklyRoutine.schema";
import { IWeeklyRoutine } from "../models/weeklyRoutine";

type SanitizedRoutine = {
  id: string;
  title: string;
  description?: string;
  dayOfWeek: string;
  timeOfDay: string;
  isActive: boolean;
  category?: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
};

export class WeeklyRoutineService {
  async createRutine(
    userId: string,
    data: CreateWeeklyRoutineDto
  ): Promise<SanitizedRoutine> {
    const routine = await WeeklyRoutine.create({
      ...data,
      user: userId,
    });

    return this.sanitize(routine._id, routine);
  }

  async getMyRoutines(
    userId: string,
    filters?: Partial<GetWeeklyRoutinesQuery>
  ): Promise<SanitizedRoutine[]> {
    const query: any = { user: userId };
    if (filters?.dayOfWeek) query.dayOfWeek = filters.dayOfWeek;
    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive === "true";
    }
    if (filters?.category) query.category = filters.category;

    const routines = await WeeklyRoutine.find(query).sort({
      dayOfWeek: 1,
      timeOfDay: 1,
    });

    return routines.map((routine) => this.sanitize(routine._id, routine));
  }

  async getWeeklySchedule(userId: string): Promise<any> {
    const routines = await WeeklyRoutine.find({
      user: userId,
      isActive: true,
    }).sort({ timeOfDay: 1 });

    const schedule: Record<string, SanitizedRoutine[]> = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };
    routines.forEach((routine) => {
      // ← Quitar ": any"
      if (routine.dayOfWeek) {
        // ← Agregar validación
        schedule[routine.dayOfWeek].push(this.sanitize(routine._id, routine));
      }
    });

    return schedule;
  }

  async getRoutineById(
    userId: string,
    routineId: string
  ): Promise<SanitizedRoutine> {
    const routine = await WeeklyRoutine.findOne({
      _id: routineId,
      user: userId,
    });
    if (!routine) throw new AppError("Routine not found", 404);
    return this.sanitize(routine._id, routine);
  }

  async updateRoutine(
    userId: string,
    routineId: string,
    data: UpdateWeeklyRoutineDto
  ): Promise<SanitizedRoutine> {
    const routine = await WeeklyRoutine.findOneAndUpdate(
      { _id: routineId, user: userId },
      data,
      { new: true, runValidators: true }
    );
    if (!routine) throw new AppError("Routine not found", 404);
    return this.sanitize(routine._id, routine);
  }

  async deleteRoutine(userId: string, routineId: string): Promise<void> {
    const routine = await WeeklyRoutine.findOneAndDelete({
      _id: routineId,
      user: userId,
    });
    if (!routine) throw new AppError("Routine not found", 404);
  }
  // Sanitizar datos
  private sanitize(
    id: mongoose.Types.ObjectId | string,
    r: IWeeklyRoutine
  ): SanitizedRoutine {
    return {
      id: typeof id === "string" ? id : id.toString(),
      title: r.title,
      description: r.description,
      dayOfWeek: r.dayOfWeek,
      timeOfDay: r.timeOfDay,
      isActive: r.isActive,
      category: r.category,
      user: typeof r.user === "string" ? r.user : r.user.toString(),
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }
}

export default new WeeklyRoutineService();