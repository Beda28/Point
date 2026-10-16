import { Module }         from '@nestjs/common';
import { AuthModule }     from './auth/auth.module.js';
import { DatabaseModule } from './database/database.module.js';
import { ProductModule }  from './products/product.module.js';

@Module({
  imports: [DatabaseModule, AuthModule, ProductModule],
})
export class AppModule {}
