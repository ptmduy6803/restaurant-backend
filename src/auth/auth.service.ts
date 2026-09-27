import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService} from "../prisma/prisma.service";
import * as argon2 from 'argon2';
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.usersService.findByEmail(dto.email)

    if (existingUser) {
      throw new ConflictException('Email is already in use')
    }

    const passwordHash = await argon2.hash(dto.password)

    return this.usersService.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
    })
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (
      !user ||
      !user.isActive ||
      !(await argon2.verify(user.passwordHash, dto.password))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      role: user.role,
    }

    const accessToken = await this.jwtService.signAsync(payload);

    const sessionId = randomUUID();
    const randomSecret = randomBytes(32).toString('base64url');
    const refreshToken = `${sessionId}.${randomSecret}`;
    const refreshTokenHash = createHash("sha256")
      .update(refreshToken)
      .digest('hex');
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await this.prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        refreshTokenHash,
        expiresAt,
      }
    })

    return {
      accessToken,
      refreshToken,
    }
  }

  async refresh(dto: RefreshTokenDto) {
    const [sessionId] = dto.refreshToken.split('.');

    if (!sessionId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const session = await this.prisma.session.findUnique({
      where: {id: sessionId},
      include: {
        user: {
          select: {
            id: true,
            role: true,
            isActive: true,
          }
        }
      }
    })

    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!session.user.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const refreshTokenHash = createHash("sha256")
      .update(dto.refreshToken)
      .digest('hex');

    if (refreshTokenHash != session.refreshTokenHash) {
      await this.prisma.session.update({
        where: {
          id: session.id,
        },
        data: {
          revokedAt: new Date(),
        }
      })

      throw new UnauthorizedException('Invalid refresh token');
    }

    const newRefreshTokenSecret = randomBytes(32).toString('base64url');
    const newRefreshToken = `${sessionId}.${newRefreshTokenSecret}`;

    const newRefreshTokenHash = createHash("sha256")
      .update(newRefreshToken)
      .digest('hex');

    const updateResult = await this.prisma.session.updateMany({
      where: {
        id: sessionId,
        refreshTokenHash,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        }
      },
      data: {
        refreshTokenHash: newRefreshTokenHash,
      }
    })

    if (updateResult.count !== 1) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = {
      sub: session.user.id,
      role: session.user.role,
    }

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    }
  }

  async logout(dto: RefreshTokenDto) {    //same dto
    const [sessionId] = dto.refreshToken.split('.');

    if (!sessionId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const refreshTokenHash = createHash("sha256")
      .update(dto.refreshToken)
      .digest('hex');

    const result = await this.prisma.session.updateMany({
      where: {
        id: sessionId,
        refreshTokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      }
    })

    if (result.count !== 1) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      message: 'Logged out successfully',
    }
  }
}