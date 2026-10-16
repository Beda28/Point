import { Module }         from '@nestjs/common';
import { AuthModule }     from './auth/auth.module.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [DatabaseModule, AuthModule],
})
export class AppModule {}
