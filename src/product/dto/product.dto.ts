/* eslint-disable prettier/prettier */
import { CategoryName } from "@prisma/client";

export class ProductDTO {
	id?: number;
	name: string;
	brand: string;
	category: CategoryName;
	unitPrice: number;
	stock: number;

	constructor(name: string, brand: string, category: CategoryName, unitPrice: number, stock: number) {
    	this.name = name;
    	this.brand = brand;
		this.category = category;
    	this.unitPrice = unitPrice;
    	this.stock = stock;
	}
}
