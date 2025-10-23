/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { JwtAuthGuard } from "./jwt/auth.jwtguard";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";

/**
 * AuthController
 * 
 * Exposes HTTP endpoints for user authentication, session management, and profile retrieval.
 * Delegates authentication logic to AuthService and interacts with JWT-based security.
 * Responsible for login, logout, token refresh, and returning authenticated user profile.
 * 
 * Responsibilities:
 * - Provide a login endpoint that issues JWT access and refresh tokens.
 * - Provide a logout endpoint that clears authentication cookies.
 * - Provide a refresh endpoint to generate a new access token using a valid refresh token.
 * - Protect routes with JWT authentication and return user information from the token.
 * - Work with AuthService, UserService, and JwtService to enforce authentication flows.
 * 
 * Usage:
 * - Apply @UseGuards(JwtAuthGuard) to protect routes requiring authentication.
 * - Interact with cookies to manage JWT and refresh tokens securely.
 */
@Controller('/auth')
export class AuthController{
    constructor(private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ){}

    /**
     * login(response: Response, dto: {email: string, password: string})
     * 
     * Endpoint: POST /auth/login
     * Authenticates a user and sets JWT and refresh tokens as HttpOnly cookies.
     * @param response - Express response object for setting cookies.
     * @param dto - Object containing email and password for authentication.
     * @returns A success message upon successful login.
     */
    @Post('/login')
    async login(
        @Res({passthrough: true}) response: Response,
        @Body() dto: {email: string, password:string}){
        await this.authService.login(dto.email, dto.password, response);

        return {mesagge: 'Login succesfully.'};
    }

    /**
     * logout(response: Response)
     * 
     * Endpoint: POST /auth/logout
     * Clears JWT and refresh token cookies to log out the user.
     * @param response - Express response object for clearing cookies.
     * @returns A message confirming logout.
     */
    @Post('/logout')
    logout(@Res({ passthrough: true }) response: Response) {
        response.cookie('jwt', '', { maxAge: 0 });
        response.cookie('refresh', '', { maxAge: 0 });
        
        return { message: 'Logout successful' };
    }

    /**
     * refreshToken(request: any, response: Response)
     * 
     * Endpoint: POST /auth/refresh
     * Uses the refresh token cookie to issue a new access token.
     * Updates the JWT cookie with the new token.
     * @param request - Express request object containing cookies.
     * @param response - Express response object for updating cookies.
     * @returns A message confirming successful token refresh.
     */
    @Post('/refresh')
    async refreshToken(@Req() request, @Res({ passthrough: true }) response: Response){
        await this.authService.refreshToken(request, response);
        
        return {message: "Refreshed succesfully"}
    }

    /**
     * getProfile(req: any)
     * 
     * Endpoint: GET /auth/profile
     * Returns the authenticated user's profile information extracted from the JWT.
     * Requires JWT authentication via JwtAuthGuard.
     * @param req - Express request object containing the authenticated user.
     * @returns The user object with ID, email, and privileges.
     */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }
}