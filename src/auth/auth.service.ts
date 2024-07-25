import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && this.usersService.isValidPassword(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };
    const refreshToken = this.createRefreshToken(payload);
    // update user with refresh token
    await this.usersService.updateUserToken(refreshToken, _id);
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }

  async register(user: RegisterDto) {
    return this.usersService.register(user);
  }

  createRefreshToken(payload: any) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),

      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')) / 1000,
    });
    return refreshToken;
  }

  async refresh(refreshToken: string, response: Response) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      });
      let user = await this.usersService.findUserToken(refreshToken);
      if (user) {
        const { _id, name, email, role } = user;
        const payload = {
          sub: 'token login',
          iss: 'from server',
          _id,
          name,
          email,
          role,
        };
        const newRefreshToken = this.createRefreshToken(payload);
        await this.usersService.updateUserToken(refreshToken, _id.toString());

        response.clearCookie('refresh_token');

        response.cookie('refresh_token', newRefreshToken, {
          httpOnly: true,
          maxAge:
            ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')) /
            1000,
        });
        return {
          access_token: this.jwtService.sign(payload),
          user: { _id, name, email, role },
        };
      }
    } catch (error) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
    }
  }

  async logout(response: Response, user: IUser) {
    await this.usersService.updateUserToken('', user._id);
    response.clearCookie('refresh_token');
    return 'Đăng xuất thành công';
  }
}
