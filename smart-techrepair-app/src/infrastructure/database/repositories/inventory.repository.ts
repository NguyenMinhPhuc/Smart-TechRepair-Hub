import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../../core/domain/entities/category.entity';
import { PartEntity } from '../../../core/domain/entities/part.entity';
import {
  CreatePartParams,
  UpdatePartParams,
  UpdateCategoryParams,
  IInventoryRepository,
} from '../../../core/interfaces/repositories/inventory.repository.interface';
import { SpCallerService } from '../sp-caller.service';
import { CategoryOrmEntity } from '../typeorm/entities/category.orm-entity';
import { PartOrmEntity } from '../typeorm/entities/part.orm-entity';

@Injectable()
export class InventoryRepository implements IInventoryRepository {
  constructor(
    @InjectRepository(PartOrmEntity)
    private readonly partsRepo: Repository<PartOrmEntity>,
    @InjectRepository(CategoryOrmEntity)
    private readonly catRepo: Repository<CategoryOrmEntity>,
    private readonly sp: SpCallerService,
  ) {}

  async createPart(params: CreatePartParams): Promise<PartEntity> {
    // Use raw insert via query since SP handles validation
    await this.sp.execute('sp_CreatePart', {
      CategoryId: params.categoryId,
      Name: params.name,
      SerialIMEI: params.serialIMEI,
      Price: params.price,
    });
    const part = await this.partsRepo.findOne({
      where: { serialIMEI: params.serialIMEI, isDeleted: false },
    });
    return this.partToEntity(part!);
  }

  async updatePart(params: UpdatePartParams): Promise<PartEntity> {
    const part = await this.partsRepo.findOne({
      where: { partId: params.partId, isDeleted: false },
    });
    if (!part) {
      throw new Error('Linh kiện không tồn tại.');
    }

    if (params.name !== undefined) part.name = params.name;
    if (params.categoryId !== undefined) part.categoryId = params.categoryId;
    if (params.serialIMEI !== undefined) part.serialIMEI = params.serialIMEI;
    if (params.price !== undefined) part.price = params.price;
    if (params.status !== undefined) part.status = params.status;

    const saved = await this.partsRepo.save(part);
    return this.partToEntity(saved);
  }

  async findPartById(partId: string): Promise<PartEntity | null> {
    const entity = await this.partsRepo.findOne({ where: { partId, isDeleted: false } });
    return entity ? this.partToEntity(entity) : null;
  }

  async findAllParts(filters: {
    categoryId?: string;
    status?: string;
    page: number;
    limit: number;
  }): Promise<{ data: PartEntity[]; total: number }> {
    const qb = this.partsRepo
      .createQueryBuilder('p')
      .where('p.isDeleted = :deleted', { deleted: false });
    if (filters.categoryId) qb.andWhere('p.categoryId = :cat', { cat: filters.categoryId });
    if (filters.status) qb.andWhere('p.status = :status', { status: filters.status });

    const [data, total] = await qb
      .orderBy('p.createdAt', 'DESC')
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .getManyAndCount();

    return { data: data.map((e) => this.partToEntity(e)), total };
  }

  async softDeletePart(partId: string): Promise<void> {
    await this.sp.execute('sp_SoftDeleteEntity', { EntityType: 'Part', EntityId: partId });
  }

  async createCategory(name: string, description?: string): Promise<CategoryEntity> {
    await this.sp.execute('sp_CreateCategory', { Name: name, Description: description ?? null });
    const cat = await this.catRepo.findOne({ where: { name, isDeleted: false } });
    return this.catToEntity(cat!);
  }

  async updateCategory(params: UpdateCategoryParams): Promise<CategoryEntity> {
    const cat = await this.catRepo.findOne({
      where: { categoryId: params.categoryId, isDeleted: false },
    });
    if (!cat) {
      throw new Error('Danh mục không tồn tại.');
    }

    if (params.name !== undefined) cat.name = params.name;
    if (params.description !== undefined) cat.description = params.description;

    const saved = await this.catRepo.save(cat);
    return this.catToEntity(saved);
  }

  async findAllCategories(): Promise<CategoryEntity[]> {
    const cats = await this.catRepo.find({ where: { isDeleted: false }, order: { name: 'ASC' } });
    return cats.map((c) => this.catToEntity(c));
  }

  async findCategoryById(categoryId: string): Promise<CategoryEntity | null> {
    const entity = await this.catRepo.findOne({ where: { categoryId, isDeleted: false } });
    return entity ? this.catToEntity(entity) : null;
  }

  async softDeleteCategory(categoryId: string): Promise<void> {
    await this.sp.execute('sp_SoftDeleteEntity', { EntityType: 'Category', EntityId: categoryId });
  }

  private partToEntity(orm: PartOrmEntity): PartEntity {
    const e = new PartEntity();
    e.partId = orm.partId;
    e.categoryId = orm.categoryId;
    e.name = orm.name;
    e.serialIMEI = orm.serialIMEI;
    e.status = orm.status as PartEntity['status'];
    e.price = Number(orm.price);
    e.isDeleted = orm.isDeleted;
    e.createdAt = orm.createdAt;
    e.updatedAt = orm.updatedAt;
    return e;
  }

  private catToEntity(orm: CategoryOrmEntity): CategoryEntity {
    const e = new CategoryEntity();
    e.categoryId = orm.categoryId;
    e.name = orm.name;
    e.description = orm.description ?? undefined;
    e.isDeleted = orm.isDeleted;
    e.createdAt = orm.createdAt;
    return e;
  }
}
