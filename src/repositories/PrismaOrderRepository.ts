
import { PrismaClient } from '@prisma/client';
import { IOrderRepository } from './IOrderRepository';

const prisma = new PrismaClient();

export class PrismaOrderRepository implements IOrderRepository {
  async create(data: {
    customer: string;
    items: string;
    total: number;
    status: string;
  }) {
    return prisma.order.create({
      data
    });
  }
}
