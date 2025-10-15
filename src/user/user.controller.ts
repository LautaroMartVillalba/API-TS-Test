/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { UserResponseDTO } from './user.dtoresponse';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/post')
  createUser(@Body() userDTO: UserDTO){   
    return this.userService.createUser(userDTO);
  }

  @Get('/all')
  getAllUsers(): Promise<UserResponseDTO[]> {
    return this.userService.findAll();
  }

  @Get('/byemail')
  getByEmail(@Query('email') email: string): Promise<UserResponseDTO[]>{
    return this.userService.findByEmail(email);
  }

  @Patch('/update')
  updateUser(@Query('email') email: string,@Body() dto: UserDTO): Promise<UserResponseDTO>{
    return this.userService.update(email, dto);
  }

  @Delete('/delete')
  deleteByEmail(@Query('email') email: string) {
    this.userService.delete(email);
  }
}
