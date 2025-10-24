/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO } from './product.dto';
import { ProductResponseDTO } from './product.dtoresponse';
import { Privileges } from 'src/auth/auth.decorator';
import { AuthGuard } from '@nestjs/passport';
import { PrivilegesName } from '@prisma/client';
import { PermissionGuard } from 'src/auth/auth.permissionguard';
import { CategoryGuard } from 'src/auth/role/role.categoryguard';

/**
 * ProductController
 * 
 * Exposes HTTP endpoints for managing products within the system. Acts as the
 * interface between client requests and the ProductService, handling input
 * validation, authentication, and authorization.
 * 
 * Responsibilities:
 * - Provide RESTful endpoints for creating, reading, updating, and deleting products.
 * - Apply JWT-based authentication and permission-based authorization.
 * - Map incoming request data to DTOs and delegate operations to ProductService.
 * - Restrict access to endpoints based on user privileges using PermissionGuard and custom decorators.
 */
@Controller('/product')
export class ProductController {
	constructor(private productService: ProductService) {}

	/**
	 * createProduct(productDTO: ProductDTO)
	 * 
	 * Endpoint: POST /product/create
	 * Creates a new product in the system. Requires JWT authentication and POST privilege.
	 * @param productDTO - Data Transfer Object containing product details.
	 * @returns The newly created product entity.
	 */
	@Post('/create')
	@UseGuards(AuthGuard('jwt'), CategoryGuard, PermissionGuard)
	@Privileges(PrivilegesName.POST.toString())
	createProduct(@Body() productDTO: ProductDTO){
	    return this.productService.createProduct(productDTO);
	}

	/**
	 * getAllProducts(): Promise<ProductResponseDTO[]>
	 * 
	 * Endpoint: GET /product/all
	 * Retrieves all products. Requires JWT authentication and READ privilege.
	 * @returns An array of ProductResponseDTO representing all products.
	 */
	@Get('/all')
	@UseGuards(AuthGuard('jwt'), CategoryGuard, PermissionGuard)
	@Privileges(PrivilegesName.READ.toString())
	getAllProducts(): Promise<ProductResponseDTO[]> {
		return this.productService.findAll();
	}

	/**
	 * getByName(name: string): Promise<ProductResponseDTO[]>
	 * 
	 * Endpoint: GET /product/byname
	 * Retrieves products matching a specific name. Requires JWT authentication and READ privilege.
	 * @param name - The name of the product(s) to retrieve.
	 * @returns An array of ProductResponseDTO objects matching the name.
	 */
	@Get('/byname')
	@UseGuards(AuthGuard('jwt'), CategoryGuard, PermissionGuard)
	@Privileges(PrivilegesName.READ.toString())
	getByName(@Query('name') name: string): Promise<ProductResponseDTO[]>{
		return this.productService.findByName(name);
	}

	/**
	 * updateProduct(id: string, dto: ProductDTO): Promise<ProductResponseDTO>
	 * 
	 * Endpoint: PATCH /product/update
	 * Updates an existing product's attributes. Requires JWT authentication and PATCH privilege.
	 * Converts the query string ID to a number before calling ProductService.
	 * @param id - The ID of the product to update (string from query, parsed to number).
	 * @param dto - Data Transfer Object containing updated product details.
	 * @returns Updated ProductResponseDTO object.
	 */
	@Patch('/update')
	@UseGuards(AuthGuard('jwt'), CategoryGuard, PermissionGuard)
	@Privileges(PrivilegesName.PATCH.toString())
	updateProduct(@Query('id') id: string, @Body() dto: ProductDTO): Promise<ProductResponseDTO>{
		const parsedId = Number(id);
		return this.productService.update(parsedId, dto);
	}

	/**
	 * deleteById(id: string)
	 * 
	 * Endpoint: DELETE /product/delete
	 * Deletes a product by its ID. Requires JWT authentication and DELETE privilege.
	 * Converts the query string ID to a number before calling ProductService.
	 * @param id - The ID of the product to delete (string from query, parsed to number).
	 */
	@Delete('/delete')
	@UseGuards(AuthGuard('jwt'), CategoryGuard, PermissionGuard)
	@Privileges(PrivilegesName.DELETE.toString())
	deleteById(@Query('id') id: string) {
		const parsedId = Number(id);
		this.productService.delete(parsedId);
	}
}
