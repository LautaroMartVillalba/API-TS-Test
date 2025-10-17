/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { UserResponseDTO } from './user.dtoresponse';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/auth/auth.permissionguard';
import { Privileges } from 'src/auth/auth.decorator';
import { PrivilegesName } from '@prisma/client';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create')
  createUser(@Body() userDTO: UserDTO){   
    return this.userService.createUser(userDTO);
  }

  @Get('/all')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Privileges(PrivilegesName.READ.toString())
  getAllUsers(): Promise<UserResponseDTO[]> {
    return this.userService.findAll();
  }

  @Get('/byemail')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Privileges(PrivilegesName.READ.toString())
  getByEmail(@Query('email') email: string): Promise<UserResponseDTO>{
    return this.userService.findByEmail(email);
  }

  @Patch('/update')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Privileges(PrivilegesName.PATCH.toString())
  updateUser(@Query('email') email: string,@Body() dto: UserDTO): Promise<UserResponseDTO>{
    return this.userService.update(email, dto);
  }

  @Delete('/delete')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Privileges(PrivilegesName.DELETE.toString())
  deleteByEmail(@Query('email') email: string) {
    this.userService.delete(email);
  }
}
