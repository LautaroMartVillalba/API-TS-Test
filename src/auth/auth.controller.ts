/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
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
        @Body() dto: {email: string, password:string}
        ){
        const { accessToken, refreshToken } = await this.authService.login(dto.email, dto.password);

        response.cookie('jwt', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 15,
            }
        );

        response.cookie('refresh', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7,
            }
        );

        return {mesagge: 'Login succesfully.'};
    }

    @Post('/logout')
    logout(@Res({ passthrough: true }) response: Response) {
        response.cookie('jwt', '', { maxAge: 0 });
        response.cookie('refresh', '', { maxAge: 0 });
        
        return { message: 'Logout successful' };
    }

    @Post('/refresh')
    async refreshToken(@Req() req, @Res({ passthrough: true }) response: Response){
        const tokenRefresh = req.cookies?.refresh;
        if(!tokenRefresh){
            throw new UnauthorizedException("Refresh token does not exists,");
        }

        const jwt = await this.authService.refreshToken(req);

        response.cookie(
            'jwt',
            jwt,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 15
            }
        );

        return {message: "Refreshed succesfully"}
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }
}