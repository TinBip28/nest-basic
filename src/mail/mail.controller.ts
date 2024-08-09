import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,
  ) {}

  @Get()
  @Public()
  @ResponseMessage('Test mail sent')
  async handleTestMail() {
    await this.mailerService.sendMail({
      to: 'lequangtin_t67@hus.edu.vn',
      from: '"Support team" <support@example.com>',
      subject: 'Test mail bla bla blas',
      html: '<b>Test mail</b>',
    });
  }
}
