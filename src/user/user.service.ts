/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserDTO } from './user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDTO } from './user.dtoresponse';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

/**
 * UserService
 * 
 * Provides the core business logic for user management in the application, including
 * creation, retrieval, updating, and deletion of users. Integrates directly with
 * PrismaService to interact with the underlying database. Also handles validation
 * and transformation of user data between DTOs and database entities.
 * 
 * Responsibilities:
 * - Validate incoming UserDTO objects before persistence.
 * - Create new users with specified privileges and credentials.
 * - Retrieve users by ID, email, or fetch all users.
 * - Transform database entities to UserResponseDTO for controlled response exposure.
 * - Update existing users and delete users by email.
 * - Provide raw user data for authentication purposes without transformation.
 */
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * validateDTO(dto: UserDTO): boolean
   * 
   * Validates that a UserDTO object contains all required fields (email, password, privileges).
   * @param dto - The UserDTO object to validate.
   * @returns true if all required fields are present, false otherwise.
   */
  validateDTO(dto:UserDTO): boolean {
    return dto.email != null &&
            dto.password != null &&
            dto.roleName != null;
  }

  // async hashPassword(pass: string): Promise<string>{
  //   const saltValue: number = 10;
  //   const salt = await bCrypt.
  // }

  /**
   * createUser(userDTO: UserDTO)
   * 
   * Creates a new user record in the database with the provided DTO data.
   * Throws an error if the DTO is null.
   * @param userDTO - Data Transfer Object containing email, password, and privileges.
   * @returns The created user entity.
   */
  async createUser(userDTO: UserDTO): Promise<User>{
    if(userDTO == null){
      throw new ConflictException("User info body cannot be null.");
    }


    const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

    const hashed = await bcrypt.hash(userDTO.password, rounds);

    const role: Role = await this.prisma.role.findUnique({
      where: {
        name: userDTO.roleName
      }
    });

    if(!role){
      throw new Error("Role not found.");
    }

    return this.prisma.user.create({
      data: {
        email: userDTO.email,
        password: hashed,
        role_id: role.id,
      },
    });
  }

  /**
   * findAll(): Promise<UserResponseDTO[]>
   * 
   * Retrieves all users from the database and transforms them into UserResponseDTO objects.
   * @returns An array of UserResponseDTO representing all users.
   */
  async findAll(): Promise<UserResponseDTO[]> {
    const result = await this.prisma.user.findMany({
      include: {
        role: true
      }
    });
    
    return plainToInstance(UserResponseDTO, result, {excludeExtraneousValues: true});
  }

  /**
   * findByEmail(email: string): Promise<UserResponseDTO>
   * 
   * Finds a single user by their email and returns it as a UserResponseDTO.
   * Throws an error if the email is null, empty, or invalid.
   * @param email - The email of the user to retrieve.
   * @returns UserResponseDTO object corresponding to the given email.
   */
  async findByEmail(email: string): Promise<UserResponseDTO> {
    if (!email || email == null || email.trim() === ''){
      throw new ConflictException("Email cannot be null.");
    }

    const result = await this.prisma.user.findUnique({
      where: {email}
    });

    return plainToInstance(UserResponseDTO, result, {excludeExtraneousValues: true});
  }

  /**
   * findById(id: number): Promise<UserResponseDTO>
   * 
   * Finds a user by their database ID and returns it as a UserResponseDTO.
   * Throws an error if the ID is null or undefined.
   * @param id - The unique identifier of the user.
   * @returns UserResponseDTO object corresponding to the given ID.
   */
  async findById(id: number): Promise<UserResponseDTO>{
    if(!id){
      throw new ConflictException("Id cannot be null.");
    }

    const result = await this.prisma.user.findUnique({
      where: {id}
    });

    return plainToInstance(UserResponseDTO, result, {excludeExtraneousValues: true})
  }

  /**
   * findRawByEmailForAuth(email: string)
   * 
   * Retrieves the raw user entity by email without transforming it to a DTO.
   * Used primarily for authentication logic.
   * Throws an error if the email is null or empty.
   * @param email - The email of the user.
   * @returns Raw user entity from the database.
   */
  async findRawByEmailForAuth(email: string) {
    if (email == null || email == '') {
      throw new ConflictException('Email cannot be null.');
    }
    const result = await this.prisma.user.findUnique({ where: { email } });
    return result;
  }

  /**
   * delete(email: string)
   * 
   * Deletes a user record from the database identified by the given email.
   * Throws an error if the email is null or empty.
   * @param email - The email of the user to delete.
   * @returns The deleted user entity.
   */
  async delete(email: string) {
    if (!email || email == null || email.trim() === ''){
      throw new ConflictException("Email cannot be null.");
    }

    return this.prisma.user.delete({
      where: {email}
    })
  }

  /**
   * update(email: string, dto: UserDTO)
   * 
   * Updates an existing user's password and privileges based on the provided DTO.
   * Throws an error if the email or DTO is null.
   * Transforms the updated entity to UserResponseDTO before returning.
   * @param email - The email of the user to update.
   * @param dto - Data Transfer Object containing updated password and privileges.
   * @returns Updated UserResponseDTO object.
   */
  async update(email: string, dto: UserDTO){
    if (!email || email == null || email.trim() === ''){
      throw new ConflictException("Email cannot be null.");
    }
    if(dto == null){
      throw new ConflictException("User info body cannot be null.");
    }

    const userInDB = this.prisma.user.findUnique({
      where:{
        email: email
      }
    });

    const result = await this.prisma.user.update({
      where: {email},
      data: {
        email: dto.email ?? (await userInDB).email,
        password: dto.password ?? (await userInDB).password,
        role_id: dto.roleId ?? (await userInDB).role_id
      }
    });

    return plainToInstance(UserResponseDTO, result, {excludeExtraneousValues:true});
  }

}
