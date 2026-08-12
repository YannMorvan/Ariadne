import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(
    taskDto: CreateTaskDto,
    userId: string,
  ): Promise<TaskEntity> {
    const project = await this.prisma.project.findFirst({
      where: {
        id: taskDto.projectId,
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
    });

    if (!project) {
      throw new NotFoundException(
        "Project not found or you don't have access to this project",
      );
    }

    const newTask = await this.prisma.task.create({
      data: {
        title: taskDto.title,
        description: taskDto.description,
        status: taskDto.status,
        priority: taskDto.priority,
        dueDate: taskDto.dueDate,
        estimatedHours: taskDto.estimatedHours,
        projectId: taskDto.projectId,
        assigneeId: taskDto.assigneeId,
      },
    });

    return new TaskEntity(newTask);
  }

  async getPriorityTasks(
    userId: string,
    limit?: number,
  ): Promise<TaskEntity[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        OR: [
          { assigneeId: userId },
          { project: { ownerId: userId } },
          { project: { members: { some: { userId } } } },
        ],
        status: {
          notIn: ['DONE'],
        },
      },
      include: {
        assignee: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' }, // URGENT -> HIGH -> MEDIUM -> LOW
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });

    return tasks.map((task) => new TaskEntity(task));
  }

  async getTasksByProjectId(
    userId: string,
    projectId: string,
  ): Promise<TaskEntity[]> {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
    });

    if (!project) {
      throw new NotFoundException(
        "Project not found or you don't have access to this project",
      );
    }

    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tasks.map((task) => new TaskEntity(task));
  }

  async updateTask(
    taskId: string,
    userId: string,
    updateData: UpdateTaskDto,
  ): Promise<TaskEntity> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const isProjectOwner = task.project.ownerId === userId;
    const isAssignee = task.assigneeId === userId;
    const isProjectMember = task.project.members.some(
      (member) => member.userId === userId,
    );

    if (!isProjectOwner && !isAssignee && !isProjectMember) {
      throw new ForbiddenException(
        "You don't have permission to update this task",
      );
    }

    // Extract ID and convert dueDate if present
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, dueDate, ...restData } = updateData;

    const dataToUpdate: Record<string, any> = { ...restData };

    if (dueDate !== undefined) {
      dataToUpdate.dueDate = dueDate ? new Date(dueDate) : null;
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: dataToUpdate,
    });

    return new TaskEntity(updatedTask);
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const isProjectOwner = task.project.ownerId === userId;
    const isAssignee = task.assigneeId === userId;
    const isProjectMember = task.project.members.some(
      (member) => member.userId === userId,
    );

    const canDelete = isProjectOwner || isAssignee || isProjectMember;

    if (!canDelete) {
      throw new ForbiddenException(
        "You don't have permission to delete this task",
      );
    }

    await this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
