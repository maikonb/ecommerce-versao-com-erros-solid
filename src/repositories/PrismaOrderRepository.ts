import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../container/types';
import { IOrderRepository } from './IOrderRepository';

const prisma = new PrismaClient();

@injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(
    @inject(TYPES.PrismaClient)
    private prisma: PrismaClient
  ) {}

  async create(data: {
    customer: string;
    items: string;
    total: number;
    status: string;
  }) {
    return this.prisma.order.create({ data });
  }
}