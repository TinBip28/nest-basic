import { Module } from '@nestjs/common';
import { SubcribersService } from './subcribers.service';
import { SubcribersController } from './subcribers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subcriber, SubcriberSchema } from './schemas/subcriber.schemas';

@Module({
  controllers: [SubcribersController],
  providers: [SubcribersService],
  imports: [
    MongooseModule.forFeature([
      { name: Subcriber.name, schema: SubcriberSchema },
    ]),
  ],
})
export class SubcribersModule {}
