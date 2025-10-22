/* eslint-disable prettier/prettier */
import { PrismaService } from "prisma/prisma.service";
import { RoleDTO } from "./role.roledto";
import { Role } from "@prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoleService{
    constructor(private prisma: PrismaService){}

    createRole(dto: RoleDTO): Promise<Role>{
        if(dto.name == null || dto.categories == null || dto.privileges == null){
            throw new Error("Insert the entire Role data: name, category/ies name and privilege/s name");
        }

        const data = {
            name: dto.name,
            categories: dto.categories,
            privileges: dto.privileges
        }

        return this.prisma.role.create({data});
    }

    getRoleByName(name: string): Promise<Role>{
        if(name == null){
            throw new Error("Name cannot be null.");
        }
        
        return this.prisma.role.findUnique({
            where: {name}
        });
    }

    async getRoleById(id: number): Promise<Role>{
        if(id == null){
            throw new Error("Id cannot be null.");
        }

        const result: Role = await this.prisma.role.findUnique({
            where: {
                id: id
            }
        });

        return result;
    }

    async updateRole(id: number, dto: RoleDTO){
        if(!id){
            throw new Error("Id cannot be null.");
        }

        const role: Role = await this.getRoleById(id);

        const data = {
            name: null,
            privileges: null,
            categories: null,
        };

        if(dto.name){
            data.name = dto.name;
        } else{
            data.name = role.name;
        }

        if(dto.privileges){
            data.privileges = dto.privileges;
        } else{
            data.privileges = role.privileges;
        }

        if(dto.categories){
            data.categories = dto.categories;
        } else{
            data.categories = role.categories;
        }

        return this.prisma.role.updateManyAndReturn({data});
    }

    deleteRole(id: number): void{
        if(!id){
            throw new Error("Id cannot be null.");
        }

        this.prisma.role.delete({
            where: {id}
        })
    }
}