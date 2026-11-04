import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { IProductRepository } from './IProductRepository';
import { TYPES } from '../container/types';

@injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(
    @inject(TYPES.PrismaClient)
    private prisma: PrismaClient
  ) {}

  async findById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }
}