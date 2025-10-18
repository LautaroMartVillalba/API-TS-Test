/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService{
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService){}

    async login (email: string, password: string, response: Response): Promise<void>{
        const user = await this.userService.findRawByEmailForAuth(email);
        if (!user || user.password !== password) {
            throw new Error("Password doesn't matchs.");
        }
        
        const payload = {
            sub: user.id, 
            email: user.email, 
            privileges: user.privileges
        };
        
        const accessToken = await this.jwtService.signAsync(
            payload, 
            {secret : process.env.JWT_SECRET}
        );
        response.cookie('jwt', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 15,
            }
        );

        const refreshToken = await this.jwtService.signAsync(
            {sub: user.email}, 
            {secret: process.env.JWT_REFRESH_SECRET}
        );
        response.cookie('refresh', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7,
            }
        );
    }

    async verifyToken(token: string){
        return this.jwtService.verifyAsync(token);
    }

    async refreshToken(req: any, response: Response){
        const tokenRefresh = req.cookies?.refresh;
            if(!tokenRefresh){
                throw new UnauthorizedException("Refresh token does not exists,");
            }
            
            const refreshSecret = process.env.JWT_REFRESH_SECRET;
            if (!refreshSecret) {
                throw new Error('JWT_REFRESH_SECRET is not set');
            }

            const payload = await this.jwtService.verifyAsync(tokenRefresh, {
                secret: refreshSecret 
            });

            const user = await this.userService.findRawByEmailForAuth(payload.sub)
            
            if(!user){
                throw new Error("user not found");
            }
            
            const newAccessToken =  await this.jwtService.signAsync(
                {
                    sub: user.id,
                    email: user.email,
                    privileges: user.privileges
                });
            
            response.cookie(
                'jwt',
                newAccessToken,
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 1000 * 60 * 15
                }
            );
            
            return newAccessToken;
    }
}