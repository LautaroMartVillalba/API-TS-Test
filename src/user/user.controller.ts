/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { UserResponseDTO } from './user.dtoresponse';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/auth/auth.permissionguard';
import { Privileges } from 'src/auth/auth.decorator';
import { PrivilegesName } from '@prisma/client';
import { CategoryGuard } from 'src/auth/role/role.categoryguard';

/**
 * UserController
 * 
 * Exposes HTTP endpoints for managing users in the system. Acts as the
 * interface between client requests and the UserService, handling input
 * validation, authorization, and delegation of business logic.
 * 
 * Responsibilities:
 * - Provide RESTful endpoints for creating, reading, updating, and deleting users.
 * - Apply JWT-based authentication and permission-based authorization.
 * - Map incoming request data to DTOs and delegate operations to UserService.
 * - Restrict access to endpoints based on user privileges using PermissionGuard and custom decorators.
 */
@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * createUser(userDTO: UserDTO)
   * 
   * Endpoint: POST /user/create
   * Creates a new user in the system.
   * @param userDTO - Data Transfer Object containing user email, password, and privileges.
   * @returns The newly created user entity.
   */
  @Post('/create')
  createUser(@Body() userDTO: UserDTO){   
    return this.userService.createUser(userDTO);
  }

  /**
   * getAllUsers(): Promise<UserResponseDTO[]>
   * 
   * Endpoint: GET /user/all
   * Retrieves all users. Requires JWT authentication and READ privilege.
   * @returns An array of UserResponseDTO representing all users.
   */
  @Get('/all')
  @UseGuards(AuthGuard('jwt'), CategoryGuard, PermissionGuard)
  @Privileges(PrivilegesName.READ.toString())
  getAllUsers(): Promise<UserResponseDTO[]> {
    return this.userService.findAll();
  }

  /**
   * getByEmail(email: string): Promise<UserResponseDTO>
   * 
   * Endpoint: GET /user/byemail
   * Retrieves a user by their email. Requires JWT authentication and READ privilege.
   * @param email - The email of the user to retrieve.
   * @returns UserResponseDTO corresponding to the given email.
   */
  @Get('/byemail')
  @UseGuards(AuthGuard('jwt'), CategoryGuard, PermissionGuard)
  @Privileges(PrivilegesName.READ.toString())
  getByEmail(@Query('email') email: string): Promise<UserResponseDTO>{
    return this.userService.findByEmail(email);
  }

  /**
   * updateUser(email: string, dto: UserDTO): Promise<UserResponseDTO>
   * 
   * Endpoint: PATCH /user/update
   * Updates the password and privileges of an existing user. Requires JWT authentication and PATCH privilege.
   * @param email - The email of the user to update.
   * @param dto - Data Transfer Object containing updated password and privileges.
   * @returns Updated UserResponseDTO object.
   */
  @Patch('/update')
  @UseGuards(AuthGuard('jwt'), CategoryGuard, PermissionGuard)
  @Privileges(PrivilegesName.PATCH.toString())
  updateUser(@Query('email') email: string,@Body() dto: UserDTO): Promise<UserResponseDTO>{
    return this.userService.update(email, dto);
  }

  /**
   * deleteByEmail(email: string)
   * 
   * Endpoint: DELETE /user/delete
   * Deletes a user by their email. Requires JWT authentication and DELETE privilege.
   * @param email - The email of the user to delete.
   */
  @Delete('/delete')
  @UseGuards(AuthGuard('jwt'), CategoryGuard, PermissionGuard)
  @Privileges(PrivilegesName.DELETE.toString())
  deleteByEmail(@Query('email') email: string) {
    this.userService.delete(email);
  }
}
