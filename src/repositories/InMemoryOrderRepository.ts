
import { injectable } from 'inversify';
import { IOrderRepository } from './IOrderRepository';

@injectable()
export class InMemoryOrderRepository implements IOrderRepository {

  private orders: any[] = [];

  async create(data: {
    customer: string;
    items: string;
    total: number;
    status: string;
  }) {
    const order = {
      id: this.orders.length + 1,
      ...data,
      createdAt: new Date()
    };

    this.orders.push(order);

    return order;
  }
}
