import { PartEntity } from '../../domain/entities/part.entity';
import { CategoryEntity } from '../../domain/entities/category.entity';

export interface CreatePartParams {
  categoryId: string;
  name: string;
  serialIMEI: string;
  price: number;
}

export interface UpdatePartParams {
  partId: string;
  categoryId?: string;
  name?: string;
  serialIMEI?: string;
  price?: number;
  status?: string;
}

export interface UpdateCategoryParams {
  categoryId: string;
  name?: string;
  description?: string;
}

export interface IInventoryRepository {
  createPart(params: CreatePartParams): Promise<PartEntity>;
  updatePart(params: UpdatePartParams): Promise<PartEntity>;
  findPartById(partId: string): Promise<PartEntity | null>;
  findAllParts(filters: { categoryId?: string; status?: string; page: number; limit: number }): Promise<{ data: PartEntity[]; total: number }>;
  softDeletePart(partId: string): Promise<void>;
  createCategory(name: string, description?: string): Promise<CategoryEntity>;
  updateCategory(params: UpdateCategoryParams): Promise<CategoryEntity>;
  findAllCategories(): Promise<CategoryEntity[]>;
  findCategoryById(categoryId: string): Promise<CategoryEntity | null>;
  softDeleteCategory(categoryId: string): Promise<void>;
}

export const INVENTORY_REPOSITORY = 'IInventoryRepository';
