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
      throw new ConflictException('Vous avez déjà un projet portant ce nom');
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
}
