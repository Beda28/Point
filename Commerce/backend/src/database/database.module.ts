import { Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import database          from './data-source.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...database.options,
      synchronize: process.env.NODE_ENV === 'development',
    }),
  ],
})
export class DatabaseModule {}
