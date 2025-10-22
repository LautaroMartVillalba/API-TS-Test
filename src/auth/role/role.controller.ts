/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Patch, Post, Query } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleDTO } from "./role.roledto";

@Controller('/role')
export class RoleController{

    constructor(private readonly service: RoleService){}

    @Post('/create')
    create(@Body() dto: RoleDTO){
        return this.service.createRole(dto);
    }

    @Get('/byid')
    getById(@Query('id') id: number){
        return this.service.getRoleById(id);
    }

    @Get('/byname')
    getByName(@Query('name') name: string){
        return this.service.getRoleByName(name);
    }

    @Patch('/update')
    update(@Query('id') id: number, @Body() dto: RoleDTO){
        return this.service.updateRole(id, dto);
    }

    @Delete('/delete')
    delete(@Query('id') id: number){
        return this.service.deleteRole(id);
    }
}