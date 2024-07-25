import { Controller, Get, Post, Render, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Req() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  @Public()
  @Get('/profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Public()
  @Post('/register')
  @ResponseMessage('Đăng kí')
  register(@Req() req) {
    return this.authService.register(req.body);
  }
}
