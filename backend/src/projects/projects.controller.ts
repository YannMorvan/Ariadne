import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  ConflictException,
  Patch,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TasksService } from '../tasks/tasks.service';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.projectsService.createProject(createProjectDto, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.projectsService.updateProject(
      { ...updateProjectDto, id },
      userId,
    );
  }

  @Get()
  async findAll(@CurrentUser('id') userId: string) {
    return this.projectsService.getProjectsByUserId(userId);
  }

  @Get('recent')
  async findRecent(@CurrentUser('id') userId: string) {
    const projects = await this.projectsService.getProjectsByUserId(userId);
    return projects
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 3);
  }

  @Get('stats')
  async getStats(@CurrentUser('id') userId: string) {
    return this.projectsService.getStatsByUserId(userId);
  }

  @Get(':id')
  async findOne(
    @CurrentUser('id') userId: string,
    @Param('id') projectId: string,
  ) {
    const project = await this.projectsService.getProjectById(projectId);
    if (project.ownerId !== userId) {
      throw new ConflictException(
        "You don't have permission to access this project",
      );
    }
    return project;
  }

  @Get(':id/tasks')
  async findTasks(
    @CurrentUser('id') userId: string,
    @Param('id') projectId: string,
  ) {
    const project = await this.projectsService.getProjectById(projectId);
    if (project.ownerId !== userId) {
      throw new ConflictException(
        "You don't have permission to access this project",
      );
    }
    return this.tasksService.getTasksByProjectId(userId, projectId);
  }

  @Delete(':id')
  async deleteProject(
    @CurrentUser('id') userId: string,
    @Param('id') projectId: string,
  ) {
    await this.projectsService.deleteProject(userId, projectId);
    return { message: 'Project deleted successfully' };
  }
}
