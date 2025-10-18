/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { PRIVILEGES_KEY } from "./auth.decorator";

@Injectable()
export class PermissionGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PRIVILEGES_KEY, 
            [context.getHandler(), context.getClass()]
        )

        if(!requiredPermissions){
            return true;
        }

        const {user} = context.switchToHttp().getRequest();

        if(!user || !user.privileges){
            return false;
        }

        return requiredPermissions.some(privilege => 
            user.privileges.includes(privilege),
        );
    }
}