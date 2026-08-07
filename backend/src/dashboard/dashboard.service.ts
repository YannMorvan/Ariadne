import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityDataPointDto } from './dto/activity-data-point.dto';

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

  async getWeeklyActivity(userId: string): Promise<ActivityDataPointDto[]> {
    const daysMap = new Map<string, ActivityDataPointDto>();

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateKey = d.toISOString().split('T')[0];

      daysMap.set(dateKey, { date: dateKey, tasks: 0 });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const completedTasks = await this.prisma.task.findMany({
      where: {
        OR: [{ assigneeId: userId }, { project: { ownerId: userId } }],
        status: 'DONE',
        updatedAt: { gte: sevenDaysAgo },
      },
      select: { updatedAt: true },
    });

    completedTasks.forEach((task) => {
      const taskDateKey = task.updatedAt.toISOString().split('T')[0];
      const dayData = daysMap.get(taskDateKey);
      if (dayData) {
        dayData.tasks += 1;
      }
    });

    return Array.from(daysMap.values());
  }
}
