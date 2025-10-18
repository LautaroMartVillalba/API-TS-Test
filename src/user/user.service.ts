import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserDTO } from './user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDTO } from './user.dtoresponse';
import { PrivilegesName } from '@prisma/client';
// prettier-ignore
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  validateDTO(dto:UserDTO): boolean {
    return dto.email != null && dto.password != null && dto.privileges != null;
  }

  async createUser(userDTO: UserDTO){
    if(userDTO == null){
      throw new Error("User info body cannot be null.");
    }

    const email: string = userDTO.email;
    const password: string = userDTO.password;
    const privileges: PrivilegesName[] = userDTO.privileges;

    const data = {email, password, privileges};

    return this.prisma.user.create({data});
  }

  async findAll(): Promise<UserResponseDTO[]> {
    const result = await this.prisma.user.findMany();

    return plainToInstance(UserResponseDTO, result, {excludeExtraneousValues: true});
  }

  async findByEmail(email: string): Promise<UserResponseDTO> {
    if (!email || email == null || email.trim() === ''){
      throw new Error("Email cannot be null.");
    }

    const result = await this.prisma.user.findUnique({
      where: {email}
    });

    return plainToInstance(UserResponseDTO, result, {excludeExtraneousValues: true});
  }

  async findById(id: number): Promise<UserResponseDTO>{
    if(!id){
      throw new Error("Id cannot be null.");
    }

    const result = await this.prisma.user.findUnique({
      where: {id}
    });

    return plainToInstance(UserResponseDTO, result, {excludeExtraneousValues: true})
  }

  // Returns the raw user record (includes password). Use carefully (e.g. for auth).
  async findRawByEmailForAuth(email: string) {
    if (email == null || email == '') {
      throw new Error('Email cannot be null.');
    }
    const result = await this.prisma.user.findUnique({ where: { email } });
    return result;
  }

  async delete(email: string) {
    if (!email || email == null || email.trim() === ''){
      throw new Error("Email cannot be null.");
    }

    return this.prisma.user.delete({
      where: {email}
    })
  }

  async update(email: string, dto: UserDTO){
    if (!email || email == null || email.trim() === ''){
      throw new Error("Email cannot be null.");
    }
    if(dto == null){
      throw new Error("User info body cannot be null.");
    }

    const data: any = {
      privileges: dto.privileges,
      password: dto.password
    };

    const result = await this.prisma.user.update({
      where: {email},
      data,
    });

    return plainToInstance(UserResponseDTO, result, {excludeExtraneousValues:true});
  }

}
