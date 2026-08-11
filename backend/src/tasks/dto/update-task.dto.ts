import { IsNotEmpty, IsString } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'The project ID is required' })
  id!: string;
}
