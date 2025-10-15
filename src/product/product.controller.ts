/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO } from './product.dto';
import { ProductResponseDTO } from './product.dtoresponse';

@Controller('/product')
export class ProductController {
	constructor(private productService: ProductService) {}

	@Post('/post')
	createProduct(@Body() productDTO: ProductDTO){
	    return this.productService.createProduct(productDTO);
	}

	@Get('/all')
	getAllProducts(): Promise<ProductResponseDTO[]> {
		return this.productService.findAll();
	}

	@Get('/byname')
	getByName(@Query('name') name: string): Promise<ProductResponseDTO[]>{
		return this.productService.findByName(name);
	}

	@Patch('/update')
	updateProduct(@Query('id') id: string, @Body() dto: ProductDTO): Promise<ProductResponseDTO>{
		const parsedId = Number(id);
		return this.productService.update(parsedId, dto);
	}

	@Delete('/delete')
	deleteById(@Query('id') id: string) {
		const parsedId = Number(id);
		this.productService.delete(parsedId);
	}
}
