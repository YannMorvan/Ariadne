export class ActivityDataPointDto {
  /**
   * Date in ISO format (YYYY-MM-DD) representing the day of the activity
   * @example "2026-08-06"
   */
  date: string = '';

  /**
   * Number of tasks completed on that date
   * @example 5
   */
  tasks: number = 0;
}
