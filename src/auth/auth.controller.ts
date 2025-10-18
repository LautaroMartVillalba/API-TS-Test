/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { JwtAuthGuard } from "./auth.jwtguard";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";

@Controller('/auth')
export class AuthController{
    constructor(private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ){}

    @Post('/login')
    async login(
        @Res({passthrough: true}) response: Response,
        @Body() dto: {email: string, password:string}){
        await this.authService.login(dto.email, dto.password, response);

        return {mesagge: 'Login succesfully.'};
    }

    @Post('/logout')
    logout(@Res({ passthrough: true }) response: Response) {
        response.cookie('jwt', '', { maxAge: 0 });
        response.cookie('refresh', '', { maxAge: 0 });
        
        return { message: 'Logout successful' };
    }

    @Post('/refresh')
    async refreshToken(@Req() request, @Res({ passthrough: true }) response: Response){
        await this.authService.refreshToken(request, response);
        
        return {message: "Refreshed succesfully"}
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }
}