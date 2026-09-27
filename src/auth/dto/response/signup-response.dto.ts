import { ApiProperty } from '@nestjs/swagger';

export class SignupResponseDto {
  @ApiProperty({
    example: '0f4ec260-1248-4cb7-8005-e6d6d69764d6',
  })
  id: string;

  @ApiProperty({
    example: 'test@example.com',
  })
  email: string;

  @ApiProperty({
    example: 'Test User',
  })
  name: string;

  @ApiProperty({
    example: 'CUSTOMER',
    enum: ['CUSTOMER', 'ADMIN'],
  })
  role: string;

  @ApiProperty({
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: '2026-09-25T06:38:43.652Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-09-25T06:38:43.652Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}
