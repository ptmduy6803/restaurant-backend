import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SignupResponseDto} from "./dto/response/signup-response.dto";
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthTokensResponseDto} from './dto/response/auth-tokens-response.dto';

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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Log in a user',
  })
  @ApiOkResponse({
    description: 'User logged in',
    type: AuthTokensResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password.',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
  })
  @ApiOkResponse({
    description: 'Tokens refreshed successfully',
    type: AuthTokensResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token',
  })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Log out',
  })
  @ApiOkResponse({
    description: 'Logged out successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh token',
  })
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto);
  }
}