
import { injectable } from 'inversify';
import { IProductRepository } from './IProductRepository';

@injectable()
export class InMemoryProductRepository implements IProductRepository {

  private products = [
    {
      id: 1,
      name: 'O Programador Pragmático (Livro Físico)',
      type: 'physical',
      price: 100.0
    },
    {
      id: 2,
      name: 'Clean Code (E-book)',
      type: 'digital',
      price: 50.0
    }
  ];

  async findById(id: number) {
    return this.products.find(product => product.id === id) ?? null;
  }
}
