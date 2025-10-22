/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './auth/role/role.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true,}),PrismaModule, UserModule, ProductModule, AuthModule, RoleModule],
})
export class AppModule {}
