/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * JwtAuthGuard
 * 
 * A NestJS authentication guard that protects routes using JWT-based authentication.
 * Extends the Passport AuthGuard with the 'jwt' strategy.
 * 
 * Responsibilities:
 * - Intercept incoming requests and verify the presence and validity of a JWT.
 * - Attach the authenticated user (decoded from JWT) to the request object.
 * - Deny access if the JWT is missing, invalid, or expired.
 * 
 * Usage:
 * Apply @UseGuards(JwtAuthGuard) on controllers or route handlers to enforce authentication.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
