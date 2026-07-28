import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
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
        "Projet introuvable ou vous n'avez pas accès à ce projet",
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
        "Projet introuvable ou vous n'avez pas accès à ce projet",
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
      throw new NotFoundException('Tâche introuvable');
    }

    const isProjectOwner = task.project.ownerId === userId;
    const isAssignee = task.assigneeId === userId;
    const isProjectMember = task.project.members.some(
      (member) => member.userId === userId,
    );

    const canDelete = isProjectOwner || isAssignee || isProjectMember;

    if (!canDelete) {
      throw new ForbiddenException(
        "Vous n'avez pas la permission de supprimer cette tâche",
      );
    }

    await this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
