import { Controller } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { Get } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ActivityDataPointDto } from './dto/activity-data-point.dto';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getUserStats(@CurrentUser('id') userId: string) {
    return this.dashboardService.getDashboardStats(userId);
  }

  @Get('activity')
  async getWeeklyActivity(
    @CurrentUser('id') userId: string,
  ): Promise<ActivityDataPointDto[]> {
    return this.dashboardService.getWeeklyActivity(userId);
  }
}
