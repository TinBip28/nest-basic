import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
        },
        //   template: {
        //     dir: join(__dirname, 'templates'),
        //     adapter: new HandlebarsAdapter(),
        //     options: {
        //       strict: true,
        //     },
        //   },
      }),
      // }),
      inject: [ConfigService],
    }),
    // MongooseModule.forFeature([
    //   { name: Subscriber.name, schema: SubscriberSchema },
    //   { name: Job.name, schema: JobSchema },
    // ]),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
