/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService{
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService){}

        async login (email: string, password: string){
                const user = await this.userService.findRawByEmailForAuth(email);
                if (!user || user.password !== password) {
                    throw new Error("Password doesn't matchs.");
                }

                const payload = {sub: user.email, privileges: user.privileges};
                const accessToken = await this.jwtService.signAsync(payload);
                const refreshToken = await this.jwtService.signAsync({sub: user.email})

                return {accessToken, refreshToken};
        }

    async verifyToken(token: string){
        return this.jwtService.verifyAsync(token);
    }
}