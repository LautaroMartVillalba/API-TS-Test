/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { PRIVILEGES_KEY } from "./auth.decorator";

/**
 * PermissionGuard
 * 
 * A NestJS guard that enforces permission-based access control on routes.
 * Checks whether the authenticated user has at least one of the required privileges
 * specified by the @Privileges decorator. Integrates with the NestJS Reflector
 * to read metadata defined at the controller or handler level.
 * 
 * Responsibilities:
 * - Intercept incoming requests and extract user information from the request object.
 * - Retrieve required privileges for the current route using Reflector.
 * - Determine if the user possesses at least one of the required privileges.
 * - Allow or deny access based on the user's privileges.
 * 
 * Usage:
 * Apply globally or at a route/controller level with @UseGuards(PermissionGuard) in
 * combination with the @Privileges decorator to enforce fine-grained authorization.
 */
@Injectable()
export class PermissionGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    /**
     * canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>
     * 
     * Determines whether a request is allowed to proceed based on user privileges.
     * @param context - ExecutionContext providing access to the current request.
     * @returns true if the user has at least one required privilege or if no privileges are specified; false otherwise.
     */
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