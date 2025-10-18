/* eslint-disable prettier/prettier */
export class ProductDTO {
	id?: number;
	name: string;
	brand: string;
	unitPrice: number;
	stock: number;

	constructor(name: string, brand: string, unitPrice: number, stock: number) {
    	this.name = name;
    	this.brand = brand;
    	this.unitPrice = unitPrice;
    	this.stock = stock;
	}
}
