/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';

export class ProductResponseDTO {

	@Expose()
	id: number;
	@Expose()
	name: string;
	@Expose()
	brand: string;
	@Expose()
	unitPrice: number;
	@Expose()
	stock: number;

}
