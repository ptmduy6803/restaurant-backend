import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthTokensResponseDto {
  @ApiProperty({

  })
  @IsString()
  accessToken: string;
}