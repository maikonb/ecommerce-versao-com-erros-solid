
import { PhysicalProduct } from './PhysicalProduct';
import { DigitalProduct } from './DigitalProduct';
import { IProduct } from './IProduct';

export class ProductFactory {
  static create(product: any): IProduct {
    if (product.type === 'physical') {
      return new PhysicalProduct(
        product.id,
        product.name,
        product.price
      );
    }

    if (product.type === 'digital') {
      return new DigitalProduct(
        product.id,
        product.name,
        product.price
      );
    }

    throw new Error('Tipo de produto não suportado');
  }
}
