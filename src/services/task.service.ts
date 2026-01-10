import { AppError } from "../middlewares/errorHandler";
import Task from "../models/task";
import {
  CreateTaskDto,
  UpdateTaskDto,
  GetTasksQuery,
} from "../schemas/task.schema";
import mongoose from "mongoose";

type SanitizedTask = {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  completed: boolean;
  dueDate?: Date;
  user: string;
  createdAt: Date;
  updatedAt: Date;
};

export class taskService {
  
  async createTask(
    userId: string,
    data: CreateTaskDto
  ): Promise<SanitizedTask> {
    const task = await Task.create({
      ...data,
      user: userId,
    });

    return this.sanitize(task._id, task);
  }

  async getMyTasks(
    userId: string,
    filters?: Partial<GetTasksQuery>
  ): Promise<{ tasks: SanitizedTask[]; pagination: any }> {
    const query: any = { user: userId };

    //Aplicar los filtros correspondientes
    if (filters?.status) query.status = filters.status;
    if (filters?.priority) query.priority = filters.priority;
    if (filters?.completed != undefined) {
      query.completed = filters.completed === "true";
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);

    return {
      tasks: tasks.map((task) => this.sanitize(task._id, task)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTaskById(userId: string, taskId: string): Promise<SanitizedTask> {
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) throw new AppError("Task not found", 404);
    return this.sanitize(task._id, task);
  }

  async updateTask(
    userId: string,
    taskId: string,
    data: UpdateTaskDto
  ): Promise<SanitizedTask> {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) throw new AppError("Task not found", 404);

    return this.sanitize(task._id, task);
  }

  async deleteTask(userId: string, taskId: string): Promise<void>{
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
    if (!task) throw new AppError("Task not found", 404);
  }

  private sanitize(
    id: mongoose.Types.ObjectId | string,
    t: any
  ): SanitizedTask {
    return {
      id: typeof id === "string" ? id : id.toString(),
      title: t.title,
      description: t.description,
      priority: t.priority,
      status: t.status,
      completed: t.completed,
      dueDate: t.dueDate,
      user: typeof t.user === "string" ? t.user : t.user.toString(),
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    };
  }
}

export default new taskService();
