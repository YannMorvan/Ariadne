import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}
  async getDashboardStats(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const activeProjects = await this.prisma.project.count({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
    });

    const totalTasks = await this.prisma.task.count({
      where: {
        OR: [{ assigneeId: userId }, { project: { ownerId: userId } }],
      },
    });

    const completedTasks = await this.prisma.task.count({
      where: {
        OR: [{ assigneeId: userId }, { project: { ownerId: userId } }],
        status: 'DONE',
      },
    });

    const completedTasksPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      streak: user?.streak ?? 0,
      activeProjects,
      pendingProjects: 0,
      completedTasksPercentage,
      level: user?.level ?? 1,
      currentXp: user?.xp ?? 0,
      nextLevelXp: 100,
    };
  }
}
