/* eslint-disable prettier/prettier */
export class ProductDTO {

	private _id: number;
	private _name: string;
	private _brand: string;
	private _unitPrice: number;
	private _stock: number;

	constructor(name: string, brand: string, unitPrice: number, stock: number) {
		this.name = name;
		this.brand = brand;
		this.unitPrice = unitPrice;
		this.stock = stock;
	}

	public get id(): number {
		return this._id;
	}
	public set id(value: number) {
		this._id = value;
	}
	public get name(): string {
		return this._name;
	}
	public set name(value: string) {
		this._name = value;
	}
	public get brand(): string {
		return this._brand;
	}
	public set brand(value: string) {
		this._brand = value;
	}
	public get unitPrice(): number {
		return this._unitPrice;
	}
	public set unitPrice(value: number) {
		this._unitPrice = value;
	}
	public get stock(): number {
		return this._stock;
	}
	public set stock(value: number) {
		this._stock = value;
	}
}
