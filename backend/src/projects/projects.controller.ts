import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TasksService } from '../tasks/tasks.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto';

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
    return this.projectsService.updateProject(id, userId, updateProjectDto);
  }

  @Get()
  async findAll(@CurrentUser('id') userId: string) {
    return this.projectsService.getProjectsByUserId(userId);
  }

  @Get('recent')
  async findRecent(@CurrentUser('id') userId: string) {
    const projects = await this.projectsService.getProjectsByUserId(userId);
    return projects
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
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
    return this.projectsService.getProjectById(projectId, userId);
  }

  @Get(':id/tasks')
  async findTasks(
    @CurrentUser('id') userId: string,
    @Param('id') projectId: string,
  ) {
    await this.projectsService.getProjectById(projectId, userId);
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

  // --------------------------------------
  // MEMBERS ROUTES
  // --------------------------------------

  @Post(':id/members')
  async addMember(
    @CurrentUser('id') userId: string,
    @Param('id') projectId: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.projectsService.addMember(projectId, userId, addMemberDto);
  }

  @Get(':id/members')
  async getMembers(
    @CurrentUser('id') userId: string,
    @Param('id') projectId: string,
  ) {
    return this.projectsService.getProjectMembers(projectId, userId);
  }

  @Delete(':id/members/:memberId')
  async removeMember(
    @CurrentUser('id') userId: string,
    @Param('id') projectId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.projectsService.removeMember(projectId, userId, memberId);
  }

  @Get('invitations/pending')
  async getPendingInvitations(@CurrentUser('id') userId: string) {
    return this.projectsService.getUserPendingInvitations(userId);
  }

  @Patch(':id/invitations/accept')
  async acceptInvitation(
    @Param('id') projectId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.projectsService.respondToInvitation(
      projectId,
      userId,
      'ACCEPTED',
    );
  }

  @Patch(':id/invitations/decline')
  async declineInvitation(
    @Param('id') projectId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.projectsService.respondToInvitation(
      projectId,
      userId,
      'DECLINED',
    );
  }
}
