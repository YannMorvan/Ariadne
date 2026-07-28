import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectEntity } from './entities/project.entity';

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
        description: projectDto.description,
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

    return projects.map((project) => new ProjectEntity(project));
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
