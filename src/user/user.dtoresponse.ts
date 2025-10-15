/* eslint-disable prettier/prettier */
import { Exclude, Expose } from "class-transformer";

export class UserResponseDTO {

    @Expose()
    id: number;
    @Expose()
    email: string;
    @Exclude()
    password: string;
    @Expose()
    privileges: string[] = [];

}
