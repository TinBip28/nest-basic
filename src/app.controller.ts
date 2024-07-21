import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  @Render('home')
  handleHome() {
    console.log('Check PORT: ', this.configService.get<string>('PORT'));
    const message = this.appService.getHello();
    return { query: message };
  }
}
