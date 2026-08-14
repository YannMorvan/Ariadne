import { ApiProperty } from '@nestjs/swagger';
import { User as PrismaUser } from '@prisma/client';

export class UserEntity implements Omit<PrismaUser, 'password'> {
  @ApiProperty({ example: '8f7d9a1e-3b2c-4a5d-6e7f-8a9b0c1d2e3f' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'user' })
  username!: string;

  @ApiProperty({ example: 'https://example.com/avatar.png', nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ example: 1250 })
  xp!: number;

  @ApiProperty({ example: 5 })
  level!: number;

  @ApiProperty({ example: 12 })
  streak!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
    delete (this as Record<string, unknown>).password;
  }
}
