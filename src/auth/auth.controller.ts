import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { SignupResponseDto} from "./dto/signup-response.dto";
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Register a new user',
  })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: SignupResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid signup data',
  })
  @ApiConflictResponse({
    description: 'Email is already used',
  })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }
}