/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PRIVILEGES_KEY } from "src/common/decorators/auth.decorator";
import { PrismaService } from "prisma/prisma.service";

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
    constructor(private reflector: Reflector, private readonly prisma: PrismaService){}

    /**
     * canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>
     * 
     * Determines whether a request is allowed to proceed based on user privileges.
     * @param context - ExecutionContext providing access to the current request.
     * @returns true if the user has at least one required privilege or if no privileges are specified; false otherwise.
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PRIVILEGES_KEY, 
            [context.getHandler(), context.getClass()]
        )
        if(!requiredPermissions){
            return true;
        }

        const {user} = context.switchToHttp().getRequest();

        if(!user || !user.role){
            return false;
        }

        const roleId = user.role;
        const roleInDb = await this.prisma.role.findUnique({
            where:{
                id: roleId
            },
        });

        if(!roleInDb){
            throw new ForbiddenException("You're not autenticated.");
        }
        const userCategories = roleInDb.privileges;

        return requiredPermissions.some(privilege =>
            userCategories.toString().includes(privilege)
        );
    }
}