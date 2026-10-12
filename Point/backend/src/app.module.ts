import { Module }         from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { PointModule }    from './point/point.module.js';

@Module({
  imports: [DatabaseModule, PointModule],
})
export class AppModule {}
