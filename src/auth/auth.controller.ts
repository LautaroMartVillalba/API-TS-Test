/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { JwtAuthGuard } from "./auth.jwtguard";

@Controller('/auth')
export class AuthController{
    constructor(private readonly authService: AuthService){}

    @Post('/login')
    async login(
        @Res({passthrough: true}) response: Response,
        @Body() dto: {email: string, password:string}
    ){
        console.log('AuthController.login received dto:', dto);
        const token = await this.authService.login(dto.email, dto.password);

        response.cookie(
            'jwt',
            token,
            {
                httpOnly: true,
                secure: true,
                maxAge: 1000*60*60
            }
        );

        return {mesagge: 'Login succesfully.'};
    }

    @Post('/logout')
    logout(@Res({ passthrough: true }) response: Response) {
      response.cookie('jwt', '', { maxAge: 0 });
      
      return { message: 'Logout successful' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
      return req.user;
    }
}