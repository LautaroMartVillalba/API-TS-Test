/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProductDTO } from './product.dto';
import { plainToInstance } from 'class-transformer';
import { ProductResponseDTO } from './product.dtoresponse';

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	validateDTO(dto: ProductDTO): boolean {
		return (
			dto.name != null &&
			dto.brand != null &&
			dto.unitPrice != null &&
			dto.stock != null
		);
	}

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

	async findAll(): Promise<ProductResponseDTO[]> {
		const result = await this.prisma.product.findMany();

		return plainToInstance(ProductResponseDTO, result, {
			excludeExtraneousValues: true,
		});
	}

		async findByName(name: string): Promise<ProductResponseDTO[]> {
			if (!name || name == null || name.trim() === '') {
				throw new Error('Name cannot be null.');
			}

		const result = await this.prisma.product.findMany({
			where: { name },
		});

		return plainToInstance(ProductResponseDTO, result, {
			excludeExtraneousValues: true,
		});
	}

	async delete(id: number) {
		if (id == null || Number.isNaN(id)) {
			throw new Error('Id cannot be null.');
		}

		return this.prisma.product.delete({
			where: { id },
		});
	}

	async update(id: number, dto: ProductDTO) {
		if (id == null || Number.isNaN(id)) {
			throw new Error('Id cannot be null.');
		}
		if (dto == null) {
			throw new Error('Product info body cannot be null.');
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
