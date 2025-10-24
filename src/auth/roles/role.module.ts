/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { ProductModule } from "src/product/product.module";

@Module({
    controllers: [RoleController],
    providers:[RoleService],
    imports: [ProductModule],
    exports: [RoleService]
})
export class RoleModule{}