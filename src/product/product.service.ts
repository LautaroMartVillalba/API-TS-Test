/* eslint-disable prettier/prettier */
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProductDTO } from './product.dto';
import { plainToInstance } from 'class-transformer';
import { ProductResponseDTO } from './product.dtoresponse';

/**
 * ProductService
 * 
 * Provides the core business logic for product management within the application.
 * Responsible for CRUD operations on products, validation of product data,
 * and transformation between database entities and DTOs for API responses.
 * 
 * Responsibilities:
 * - Validate incoming ProductDTO objects before database operations.
 * - Create new products with specified attributes such as name, brand, price, and stock.
 * - Retrieve all products or filter products by name.
 * - Update existing products by ID.
 * - Delete products by ID.
 * - Transform database product entities into ProductResponseDTO objects for controlled exposure.
 */
@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	/**
	 * validateDTO(dto: ProductDTO): boolean
	 * 
	 * Validates that a ProductDTO contains all required fields (name, brand, unitPrice, stock).
	 * @param dto - The ProductDTO object to validate.
	 * @returns true if all required fields are present, false otherwise.
	 */
	validateDTO(dto: ProductDTO): boolean {
		return (
			dto.name != null &&
			dto.brand != null &&
			dto.unitPrice != null &&
			dto.stock != null
		);
	}

	/**
	 * createProduct(productDTO: ProductDTO)
	 * 
	 * Creates a new product record in the database.
	 * Throws an error if the DTO is null.
	 * @param productDTO - Data Transfer Object containing product details.
	 * @returns The newly created product entity.
	 */
	async createProduct(productDTO: ProductDTO) {
		if (productDTO == null) {
			throw new Error('Product info body cannot be null.');
		}

		const name: string = productDTO.name;
		const brand: string = productDTO.brand;
		const unitPrice: number = productDTO.unitPrice;
		const stock: number = productDTO.stock;

		const data = { name, brand, unitPrice, stock };

		return this.prisma.product.create({ data });
	}

	/**
	 * findAll(): Promise<ProductResponseDTO[]>
	 * 
	 * Retrieves all products from the database and converts them into ProductResponseDTO objects.
	 * @returns An array of ProductResponseDTO representing all products.
	 */
	async findAll(): Promise<ProductResponseDTO[]> {
		const result = await this.prisma.product.findMany();

		return plainToInstance(ProductResponseDTO, result, {
			excludeExtraneousValues: true,
		});
	}

	/**
	 * findByName(name: string): Promise<ProductResponseDTO[]>
	 * 
	 * Retrieves products matching a specific name.
	 * Throws an error if the name is null, empty, or invalid.
	 * @param name - The name of the product(s) to retrieve.
	 * @returns An array of ProductResponseDTO objects matching the name.
	 */
	async findByName(name: string): Promise<ProductResponseDTO[]> {
		if (!name || name == null || name.trim() === '') {
			throw new NotAcceptableException('Name cannot be null.');
		}

		const result = await this.prisma.product.findMany({
			where: { name },
		});

		return plainToInstance(ProductResponseDTO, result, {
			excludeExtraneousValues: true,
		});
	}

	/**
	 * delete(id: number)
	 * 
	 * Deletes a product identified by its ID.
	 * Throws an error if the ID is null or not a number.
	 * @param id - The unique identifier of the product to delete.
	 * @returns The deleted product entity.
	 */
	async delete(id: number) {
		if (id == null || Number.isNaN(id)) {
			throw new NotAcceptableException('Id cannot be null.');
		}

		return this.prisma.product.delete({
			where: { id },
		});
	}

	/**
	 * update(id: number, dto: ProductDTO)
	 * 
	 * Updates an existing product's attributes using data from ProductDTO.
	 * Throws an error if the ID or DTO is null.
	 * @param id - The unique identifier of the product to update.
	 * @param dto - Data Transfer Object containing updated product details.
	 * @returns Updated ProductResponseDTO object.
	 */
	async update(id: number, dto: ProductDTO) {
		if (id == null || Number.isNaN(id)) {
			throw new NotAcceptableException('Id cannot be null.');
		}
		if (dto == null) {
			throw new NotAcceptableException('Product info body cannot be null.');
		}

		const result = await this.prisma.product.update({
			where: { id },
			data: {
				name: dto.name,
				brand: dto.brand,
				unitPrice: dto.unitPrice,
				stock: dto.stock,
			},
		});

		return plainToInstance(ProductResponseDTO, result, {
			excludeExtraneousValues: true,
		});
	}

}
