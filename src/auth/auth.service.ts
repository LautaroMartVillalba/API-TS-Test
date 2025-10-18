/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';

/**
 * AuthService
 * 
 * Provides authentication and token management logic for the application.
 * Handles login, JWT issuance, token verification, and refresh token flows.
 * Integrates with UserService to validate user credentials and retrieve user details.
 * 
 * Responsibilities:
 * - Authenticate users using email and password.
 * - Generate access tokens (JWT) and refresh tokens, storing them as secure HTTP-only cookies.
 * - Verify the validity of JWT tokens.
 * - Refresh access tokens using a valid refresh token.
 * - Ensure secure token handling and expiration policies.
 * 
 * Usage:
 * Injected into authentication controllers to perform login and token operations.
 */
@Injectable()
export class AuthService{
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService){}

    /**
     * login(email: string, password: string, response: Response): Promise<void>
     * 
     * Authenticates a user and issues access and refresh tokens.
     * Sets tokens as HTTP-only cookies in the response.
     * @param email - User email for login.
     * @param password - User password to verify.
     * @param response - Express response object to set cookies.
     * @throws Error if user not found or password does not match.
     */
    async login (email: string, password: string, response: Response): Promise<void>{
        const user = await this.userService.findRawByEmailForAuth(email);
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
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

    /**
     * verifyToken(token: string)
     * 
     * Verifies the provided JWT token using the configured secret.
     * @param token - JWT token string to verify.
     * @returns The decoded payload if valid.
     * @throws Error if the token is invalid or expired.
     */
    async verifyToken(token: string){
        return this.jwtService.verifyAsync(token);
    }

    /**
     * refreshToken(req: any, response: Response)
     * 
     * Generates a new access token using the refresh token stored in cookies.
     * Updates the HttpOnly cookie with the new access token.
     * @param req - Express request object containing cookies.
     * @param response - Express response object for setting the new access token cookie.
     * @returns The newly generated access token.
     * @throws UnauthorizedException if refresh token is missing or invalid.
     * @throws Error if user does not exist or refresh secret is missing.
     */
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