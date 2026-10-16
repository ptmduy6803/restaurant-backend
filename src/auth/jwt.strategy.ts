import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService} from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUser} from './types/authenticated-user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_TOKEN')
    });
  }

  async validate(payload: { sub: string, role: 'CUSTOMER' | 'ADMIN' }): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, isActive: true },
    })

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    return {
      userId: user.id,
      role: user.role,
    }
  }
}