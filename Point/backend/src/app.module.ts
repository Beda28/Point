import { Module } from '@nestjs/common';
import { PointModule } from './point/point.module.js';

@Module({
  imports: [PointModule],
})
export class AppModule {}
