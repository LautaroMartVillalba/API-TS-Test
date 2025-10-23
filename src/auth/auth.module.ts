/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import * as dotenv from 'dotenv';
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt/auth.jwtstrategy";
import { UserModule } from "src/user/user.module";
dotenv.config()

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    UserModule
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule{}