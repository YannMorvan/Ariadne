import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectEntity } from './entities/project.entity';
import { ProjectStatsDto } from './dto/project-stats.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(
    projectDto: CreateProjectDto,
    userId: string,
  ): Promise<ProjectEntity> {
    const existingProject = await this.prisma.project.findFirst({
      where: {
        name: projectDto.name,
        ownerId: userId,
      },
    });

    if (existingProject) {
      throw new ConflictException('You already have a project with this name');
    }

    const newProject = await this.prisma.project.create({
      data: {
        name: projectDto.name,
        description: projectDto.description?.trim() || null,
        priority: projectDto.priority,
        ownerId: userId,
      },
    });

    return new ProjectEntity(newProject);
  }

  async getProjectsByUserId(userId: string): Promise<ProjectEntity[]> {
    const projects = await this.prisma.project.findMany({
      where: { ownerId: userId },
    });

    const tasksCounts = await this.prisma.task.groupBy({
      by: ['projectId'],
      _count: { id: true },
      where: { project: { ownerId: userId } },
    });

    const tasksCountMap = new Map(
      tasksCounts.map((taskCount) => [
        taskCount.projectId,
        taskCount._count.id,
      ]),
    );

    const completedTasksCounts = await this.prisma.task.groupBy({
      by: ['projectId'],
      _count: { id: true },
      where: { project: { ownerId: userId }, status: 'DONE' },
    });

    const completedTasksCountMap = new Map(
      completedTasksCounts.map((taskCount) => [
        taskCount.projectId,
        taskCount._count.id,
      ]),
    );

    return projects.map((project) => {
      const tasksCount = tasksCountMap.get(project.id) || 0;
      const completedTasksCount = completedTasksCountMap.get(project.id) || 0;
      return new ProjectEntity({ ...project, tasksCount, completedTasksCount });
    });
  }

  async getProjectById(projectId: string): Promise<ProjectEntity> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new ConflictException('Project not found');
    }
    return new ProjectEntity(project);
  }

  async getStatsByUserId(userId: string): Promise<ProjectStatsDto> {
    const [
      totalProjects,
      archivedProjects,
      urgentTasksCount,
      totalTasksCount,
      completedTasksCount,
    ] = await Promise.all([
      this.prisma.project.count({
        where: { ownerId: userId },
      }),

      this.prisma.project.count({
        where: { ownerId: userId, isArchived: true },
      }),

      this.prisma.task.count({
        where: {
          project: { ownerId: userId },
          priority: 'URGENT',
          status: { not: 'DONE' },
        },
      }),

      this.prisma.task.count({
        where: { project: { ownerId: userId } },
      }),

      this.prisma.task.count({
        where: {
          project: { ownerId: userId },
          status: 'DONE',
        },
      }),
    ]);

    const activeProjects = totalProjects - archivedProjects;

    const completionRate =
      totalTasksCount > 0
        ? Math.round((completedTasksCount / totalTasksCount) * 100)
        : 0;

    return {
      totalProjects,
      activeProjects,
      archivedProjects,
      urgentTasks: urgentTasksCount,
      completionRate,
      roadmapProgress: {
        current: completedTasksCount,
        max: totalTasksCount > 0 ? totalTasksCount : 1,
      },
    };
  }

  async deleteProject(userId: string, projectId: string): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new ConflictException('Project not found');
    }
    if (project.ownerId !== userId) {
      throw new ConflictException(
        "You don't have permission to delete this project",
      );
    }
    await this.prisma.project.delete({
      where: { id: projectId },
    });
  }
}
