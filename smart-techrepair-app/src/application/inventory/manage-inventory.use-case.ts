import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CategoryEntity } from '../../core/domain/entities/category.entity';
import { PartEntity } from '../../core/domain/entities/part.entity';
import { IInventoryRepository, INVENTORY_REPOSITORY, CreatePartParams, UpdatePartParams } from '../../core/interfaces/repositories/inventory.repository.interface';

@Injectable()
export class ManageInventoryUseCase {
  constructor(
    @Inject(INVENTORY_REPOSITORY)
    private readonly inventoryRepo: IInventoryRepository,
  ) {}

  async createPart(params: CreatePartParams): Promise<PartEntity> {
    const category = await this.inventoryRepo.findCategoryById(params.categoryId);
    if (!category) throw new NotFoundException('Danh mục không tồn tại.');
    return this.inventoryRepo.createPart(params);
  }

  async updatePart(params: UpdatePartParams): Promise<PartEntity> {
    const part = await this.inventoryRepo.findPartById(params.partId);
    if (!part) throw new NotFoundException('Linh kiện không tồn tại.');

    if (params.categoryId) {
      const category = await this.inventoryRepo.findCategoryById(params.categoryId);
      if (!category) throw new NotFoundException('Danh mục không tồn tại.');
    }

    return this.inventoryRepo.updatePart(params);
  }

  async listParts(filters: { categoryId?: string; status?: string; page: number; limit: number }) {
    return this.inventoryRepo.findAllParts(filters);
  }

  async deletePart(partId: string): Promise<void> {
    const part = await this.inventoryRepo.findPartById(partId);
    if (!part) throw new NotFoundException('Linh kiện không tồn tại.');
    await this.inventoryRepo.softDeletePart(partId);
  }

  async createCategory(name: string, description?: string): Promise<CategoryEntity> {
    return this.inventoryRepo.createCategory(name, description);
  }

  async updateCategory(categoryId: string, name?: string, description?: string): Promise<CategoryEntity> {
    const cat = await this.inventoryRepo.findCategoryById(categoryId);
    if (!cat) throw new NotFoundException('Danh mục không tồn tại.');
    return this.inventoryRepo.updateCategory({ categoryId, name, description });
  }

  async listCategories(): Promise<CategoryEntity[]> {
    return this.inventoryRepo.findAllCategories();
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const cat = await this.inventoryRepo.findCategoryById(categoryId);
    if (!cat) throw new NotFoundException('Danh mục không tồn tại.');
    await this.inventoryRepo.softDeleteCategory(categoryId);
  }
}
