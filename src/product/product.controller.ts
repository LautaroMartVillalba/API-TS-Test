/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO } from './product.dto';
import { ProductResponseDTO } from './product.dtoresponse';
import { Privileges } from 'src/auth/auth.decorator';
import { AuthGuard } from '@nestjs/passport';
import { PrivilegesName } from '@prisma/client';
import { PermissionGuard } from 'src/auth/auth.permissionguard';

@Controller('/product')
export class ProductController {
	constructor(private productService: ProductService) {}

	@Post('/create')
	@UseGuards(AuthGuard('jwt'), PermissionGuard)
	@Privileges(PrivilegesName.POST.toString())
	createProduct(@Body() productDTO: ProductDTO){
	    return this.productService.createProduct(productDTO);
	}

	@Get('/all')
	@UseGuards(AuthGuard('jwt'), PermissionGuard)
	@Privileges(PrivilegesName.READ.toString())
	getAllProducts(): Promise<ProductResponseDTO[]> {
		return this.productService.findAll();
	}

	@Get('/byname')
	@UseGuards(AuthGuard('jwt'), PermissionGuard)
	@Privileges(PrivilegesName.READ.toString())
	getByName(@Query('name') name: string): Promise<ProductResponseDTO[]>{
		return this.productService.findByName(name);
	}

	@Patch('/update')
	@UseGuards(AuthGuard('jwt'), PermissionGuard)
	@Privileges(PrivilegesName.PATCH.toString())
	updateProduct(@Query('id') id: string, @Body() dto: ProductDTO): Promise<ProductResponseDTO>{
		const parsedId = Number(id);
		return this.productService.update(parsedId, dto);
	}

	@Delete('/delete')
	@UseGuards(AuthGuard('jwt'), PermissionGuard)
	@Privileges(PrivilegesName.DELETE.toString())
	deleteById(@Query('id') id: string) {
		const parsedId = Number(id);
		this.productService.delete(parsedId);
	}
}
