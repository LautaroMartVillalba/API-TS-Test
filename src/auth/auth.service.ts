/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService{
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService){}

        async login (email: string, password: string){
                    console.log('AuthService.login called with:', {email, password});
                // use raw find to get password field which is excluded in the transformed response DTO
                const user = await this.userService.findRawByEmail(email);
                    console.log('AuthService.login found user:', user && {id: user.id, email: user.email, hasPassword: !!user.password});
                if (!user || user.password !== password) {
                    throw new Error("Password doesn't matchs.");
                }

                const payload = {sub: user.id, email: user.email, privileges: user.privileges};
                const token = await this.jwtService.signAsync(payload);

                return token;
        }

    async verifyToken(token: string){
        return this.jwtService.verifyAsync(token);
    }
}