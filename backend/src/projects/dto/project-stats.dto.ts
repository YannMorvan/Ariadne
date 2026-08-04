export interface ProjectStatsDto {
  totalProjects: number;
  activeProjects: number;
  archivedProjects: number;
  urgentTasks: number;
  completionRate: number;
  roadmapProgress: {
    current: number;
    max: number;
  };
}
