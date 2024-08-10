import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Subcriber,
  SubcriberDocument,
} from 'src/subcribers/schemas/subcriber.schemas';
import { Job, JobDocument } from 'src/job/schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { name } from 'ejs';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,

    @InjectModel(Subcriber.name)
    private subcriberModel: SoftDeleteModel<SubcriberDocument>,

    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  @Get()
  @Public()
  @Cron('12 0 0 * * 0')
  @ResponseMessage('Test mail sent')
  async handleTestMail() {
    const subcribers = await this.subcriberModel.find({});
    for (const subs of subcribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({
        skills: {
          $in: subsSkills,
        },
      });
      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map((job) => {
          return {
            name: job.name,
            company: job.company.name,
            salary: `${job.salary}`
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              .concat(' $'),
            skills: job.skills,
          };
        });
        await this.mailerService.sendMail({
          to: 'lequangtin_t67@hus.edu.vn',
          from: '"Tin le" <noreply@gmail.com>',
          subject: 'Test mail bla bla blas',
          template: 'new-jobs', // The `.pug` or `.hbs` extension is added automatically
          context: {
            receiver: subs.name,
            jobs: jobs,
          },
        });
      }
    }
  }
}
