import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectEntity } from './entities/project.entity';
import { ProjectStatsDto } from './dto/project-stats.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { ProjectRole, MembershipStatus } from '@prisma/client';

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

  async updateProject(
    projectId: string,
    userId: string,
    updateData: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isOwner = project.ownerId === userId;
    const isAdmin = project.members.some(
      (m) => m.userId === userId && m.role === ProjectRole.ADMIN,
    );

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        "You don't have permission to update this project",
      );
    }

    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });

    return new ProjectEntity(updatedProject);
  }

  async getProjectsByUserId(userId: string): Promise<ProjectEntity[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId, status: 'ACCEPTED' } } },
        ],
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    const projectIds = projects.map((p) => p.id);

    const tasksCounts = await this.prisma.task.groupBy({
      by: ['projectId'],
      _count: { id: true },
      where: { projectId: { in: projectIds } },
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
      where: { projectId: { in: projectIds }, status: 'DONE' },
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
      const flattenedMembers = project.members.map((m) => ({
        id: m.user.id,
        username: m.user.username,
        email: m.user.email,
        avatarUrl: m.user.avatarUrl,
        role: m.role,
        status: m.status,
        joinedAt: m.joinedAt.toISOString(),
      }));

      return new ProjectEntity({
        ...project,
        members: flattenedMembers,
        tasksCount,
        completedTasksCount,
      });
    });
  }

  async getProjectById(
    projectId: string,
    userId: string,
  ): Promise<ProjectEntity> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
            avatarUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                username: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const hasAccess =
      project.ownerId === userId ||
      project.members.some((m) => m.userId === userId);

    if (!hasAccess) {
      throw new ForbiddenException("You don't have access to this project");
    }

    const ownerMember = {
      id: project.owner.id,
      username: project.owner.username,
      email: project.owner.email,
      avatarUrl: project.owner.avatarUrl,
      role: 'OWNER',
      status: 'ACCEPTED',
      joinedAt: project.createdAt.toISOString(),
    };

    const invitedMembers = project.members.map((m) => ({
      id: m.user.id,
      username: m.user.username,
      email: m.user.email,
      avatarUrl: m.user.avatarUrl,
      role: m.role,
      status: m.status,
      joinedAt: m.joinedAt.toISOString(),
    }));

    return new ProjectEntity({
      ...project,
      members: [ownerMember, ...invitedMembers],
    });
  }

  async getStatsByUserId(userId: string): Promise<ProjectStatsDto> {
    const userProjectsFilter = {
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    };

    const [
      totalProjects,
      archivedProjects,
      urgentTasksCount,
      totalTasksCount,
      completedTasksCount,
    ] = await Promise.all([
      this.prisma.project.count({
        where: userProjectsFilter,
      }),

      this.prisma.project.count({
        where: { ...userProjectsFilter, isArchived: true },
      }),

      this.prisma.task.count({
        where: {
          project: userProjectsFilter,
          priority: 'URGENT',
          status: { not: 'DONE' },
        },
      }),

      this.prisma.task.count({
        where: { project: userProjectsFilter },
      }),

      this.prisma.task.count({
        where: {
          project: userProjectsFilter,
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
      throw new NotFoundException('Project not found');
    }
    if (project.ownerId !== userId) {
      throw new ForbiddenException(
        "You don't have permission to delete this project",
      );
    }
    await this.prisma.project.delete({
      where: { id: projectId },
    });
  }

  // --------------------------------------
  // MEMBERS MANAGEMENT
  // --------------------------------------

  async addMember(projectId: string, currentUserId: string, dto: AddMemberDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    });

    if (!project) throw new NotFoundException('Project not found');

    const isOwner = project.ownerId === currentUserId;
    const isAdmin = project.members.some(
      (m) =>
        m.userId === currentUserId &&
        m.role === ProjectRole.ADMIN &&
        m.status === MembershipStatus.ACCEPTED,
    );

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        "You don't have permission to add members to this project",
      );
    }

    const userToAdd = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: dto.identifier.toLowerCase() } },
          { username: { equals: dto.identifier, mode: 'insensitive' } },
        ],
      },
    });

    if (!userToAdd) {
      throw new NotFoundException('No user found with this email or username.');
    }

    if (userToAdd.id === project.ownerId) {
      throw new ConflictException(
        'The user is already the owner of the project.',
      );
    }

    const existingMember = project.members.find(
      (m) => m.userId === userToAdd.id,
    );

    if (existingMember) {
      if (existingMember.status === MembershipStatus.PENDING) {
        throw new ConflictException(
          'An invitation is already pending for this user.',
        );
      }
      throw new ConflictException(
        'This user is already a member of the project.',
      );
    }

    const member = await this.prisma.projectMember.create({
      data: {
        projectId,
        userId: userToAdd.id,
        role: dto.role || ProjectRole.MEMBER,
        status: MembershipStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return {
      id: member.user.id,
      username: member.user.username,
      email: member.user.email,
      avatarUrl: member.user.avatarUrl,
      role: member.role,
      status: member.status, // 👈 Transmis au front
      joinedAt: member.joinedAt.toISOString(),
    };
  }

  async getProjectMembers(projectId: string, currentUserId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    });

    if (!project) throw new NotFoundException('Project not found');

    const hasAccess =
      project.ownerId === currentUserId ||
      project.members.some((m) => m.userId === currentUserId);

    if (!hasAccess) {
      throw new ForbiddenException("You don't have access to this project");
    }

    const members = await this.prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return members.map((m) => ({
      id: m.user.id,
      username: m.user.username,
      email: m.user.email,
      avatarUrl: m.user.avatarUrl,
      role: m.role,
      status: m.status, // 👈 Transmis au front
      joinedAt: m.joinedAt.toISOString(),
    }));
  }

  async removeMember(
    projectId: string,
    currentUserId: string,
    targetUserId: string,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    });

    if (!project) throw new NotFoundException('Project not found');

    const isOwner = project.ownerId === currentUserId;
    const isAdmin = project.members.some(
      (m) =>
        m.userId === currentUserId &&
        m.role === ProjectRole.ADMIN &&
        m.status === MembershipStatus.ACCEPTED,
    );

    if (!isOwner && !isAdmin && currentUserId !== targetUserId) {
      throw new ForbiddenException(
        "You don't have permission to remove members from this project",
      );
    }

    const memberEntry = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: targetUserId,
        },
      },
    });

    if (!memberEntry) {
      throw new NotFoundException('Member not found in this project');
    }

    return this.prisma.projectMember.delete({
      where: { id: memberEntry.id },
    });
  }

  async getUserPendingInvitations(userId: string) {
    const invitations = await this.prisma.projectMember.findMany({
      where: {
        userId,
        status: 'PENDING',
      },
      include: {
        project: {
          include: {
            owner: {
              select: { id: true, username: true, avatarUrl: true },
            },
          },
        },
      },
    });

    return invitations.map((inv) => ({
      id: inv.id,
      projectId: inv.projectId,
      projectName: inv.project.name,
      projectDescription: inv.project.description,
      invitedBy: inv.project.owner,
      role: inv.role,
      createdAt: inv.joinedAt,
    }));
  }

  async respondToInvitation(
    projectId: string,
    userId: string,
    decision: 'ACCEPTED' | 'DECLINED',
  ) {
    const membership = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });

    if (!membership || membership.status !== 'PENDING') {
      throw new NotFoundException(
        'No pending invitation found for this project and user',
      );
    }

    if (decision === 'DECLINED') {
      return this.prisma.projectMember.delete({
        where: { id: membership.id },
      });
    }

    return this.prisma.projectMember.update({
      where: { id: membership.id },
      data: { status: 'ACCEPTED' },
    });
  }
}
