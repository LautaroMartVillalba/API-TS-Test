/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";

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

    async validate(payload: any) {
        return { id: payload.sub, email: payload.email, privileges: payload.privileges };
    }
}
