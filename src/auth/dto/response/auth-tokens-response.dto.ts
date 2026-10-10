import { ApiProperty } from '@nestjs/swagger';

export class AuthTokensResponseDto {
  @ApiProperty({
    description: 'Short-lived JWT access token (15 minutes)',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Long-lived opaque refresh token (7 days)',
  })
  refreshToken: string;
}