/* eslint-disable prettier/prettier */
import { Exclude, Expose } from "class-transformer";
import { PrivilegesName } from "@prisma/client";

export class UserResponseDTO {

    @Expose()
    id: number;
    @Expose()
    email: string;
    @Exclude()
    password: string;
    @Expose()
    privileges: PrivilegesName[] = [];

}
