/* eslint-disable prettier/prettier */
import { CategoryName, PrivilegesName } from "@prisma/client";
import { User } from "generated/prisma";

export class RoleDTO{

    name: string;
    privileges: PrivilegesName[] = [];
    categories: CategoryName[] = [];
    users: User[] = [];

    constructor(name: string, privileges: PrivilegesName[], categories: CategoryName[], users: User[]){
        this.name = name;
        this.privileges = privileges;
        this.categories = categories;
        this.users = users;
    }

}