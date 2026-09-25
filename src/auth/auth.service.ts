import { ConflictException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { SignupDto } from './dto/signup.dto';
import { UsersService} from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email is already used');
    }

    const passwordHash = await argon2.hash(dto.password);

    return this.usersService.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
    });
  }
}