/* eslint-disable prettier/prettier */
import { PrismaService } from "prisma/prisma.service";
import { RoleDTO } from "./role.roledto";
import { Role } from "@prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoleService{
    constructor(private prisma: PrismaService){}

    createRole(dto: RoleDTO): Promise<Role | null>{
        if(dto.name == null || dto.categories == null || dto.privileges == null){
            throw new Error("Insert the entire Role data: name, category/ies name and privilege/s name");
        }

        return this.prisma.role.create({
            data: {
                name: dto.name,
                categories: dto.categories,
                privileges: dto.privileges
            }
        });
    }

    getRoleByName(name: string): Promise<Role | null>{
        if(name == null){
            throw new Error("Name cannot be null.");
        }
        
        return this.prisma.role.findUnique({
            where: {name},
            include: {
                users: true
            }
        });
    }

    getAllRoles(): Promise<Role[] | null>{
        return this.prisma.role.findMany();
    }

    async getRoleById(id: number): Promise<Role>{
        if(id == null){
            throw new Error("Id cannot be null.");
        }

        const result: Role = await this.prisma.role.findUnique({
            where: {
                id: id
            },
            include: {
                users: true
            }
        });

        return result;
    }

    async getPrivileges(id: number){
        if(!id){
            throw new Error("Id cannot be null.");
        }

        const result = await this.prisma.role.findUnique({
            where: {id},
            select: {
                privileges: true,
            }
        });
        
        return result;
    }

    async getCategories(id: number){
        if(!id){
            throw new Error("Id cannot be null.");
        }

        const result = await this.prisma.role.findUnique({
            where: {id},
            select: {
                categories: true,
            }
        });
        
        return result;
    }

    async updateRole(id: number, dto: RoleDTO){
        if(!id){
            throw new Error("Id cannot be null.");
        }

        const role: Role = await this.getRoleById(id);

        return this.prisma.role.update({
            where: {id},
            data: {
                name: dto.name ?? role.name,
                privileges: dto.privileges ?? role.privileges,
                categories: dto.categories ?? role.categories
                }
            }
        );
    }

    async deleteRole(id: number): Promise<Role>{
        if(!id){
            throw new Error("Id cannot be null.");
        }

        return this.prisma.role.delete({
            where: {id}
        })
    }
}