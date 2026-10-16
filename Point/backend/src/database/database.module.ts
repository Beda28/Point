import { Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitialSchema1792108800000 } from './migrations/1792108800000-initial-schema.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type             : 'mysql',
      host             : process.env.DB_HOST,
      port             : Number(process.env.DB_PORT ?? 3306),
      username         : process.env.DB_USER,
      password         : process.env.DB_PASSWORD,
      database         : process.env.DB_NAME,
      autoLoadEntities : true,
      synchronize      : false,
      migrations       : [InitialSchema1792108800000],
      migrationsRun    : true,
      supportBigNumbers: true,
      bigNumberStrings : true,
    }),
  ],
})
export class DatabaseModule {}
