/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";

/**
 * JwtStrategy
 * 
 * Implements JWT authentication strategy using Passport and NestJS. Responsible
 * for extracting, validating, and decoding JWT tokens from incoming requests.
 * Integrates with ConfigService to retrieve the secret key and configure token validation.
 * 
 * Responsibilities:
 * - Extract JWT from cookies in incoming HTTP requests.
 * - Validate token expiration and integrity using the configured secret key.
 * - Decode JWT payload and return user information for use in request context.
 * - Provide user details including ID, email, and privileges to downstream guards and controllers.
 * 
 * Usage:
 * Automatically invoked by @UseGuards(AuthGuard('jwt')) in controllers to protect routes.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private configService: ConfigService){

    super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.cookies?.jwt,]
                ),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
            }
        )
    }

    /**
     * validate(payload: any)
     * 
     * Called automatically after a JWT is successfully verified.
     * Returns a user object containing ID, email, and privileges to attach to the request.
     * @param payload - The decoded JWT payload.
     * @returns An object representing the authenticated user.
     */
    async validate(payload: any) {
        return { id: payload.sub, email: payload.email, role: payload.role };
    }
}
