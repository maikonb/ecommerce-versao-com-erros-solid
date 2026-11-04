
export interface IProductRepository {
  findById(id: number): Promise<{
    id: number;
    name: string;
    type: string;
    price: number;
  } | null>;
}
