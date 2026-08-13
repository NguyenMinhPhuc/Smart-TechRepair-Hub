import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../../../core/domain/entities/customer.entity';
import { ICustomerRepository } from '../../../core/interfaces/repositories/customer.repository.interface';
import { SpCallerService } from '../sp-caller.service';
import { CustomerOrmEntity } from '../typeorm/entities/customer.orm-entity';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly repo: Repository<CustomerOrmEntity>,
    private readonly sp: SpCallerService,
  ) {}

  async findByPhone(phone: string): Promise<CustomerEntity | null> {
    const entity = await this.repo.findOne({ where: { phone, isDeleted: false } });
    return entity ? this.toEntity(entity) : null;
  }

  async findById(customerId: string): Promise<CustomerEntity | null> {
    const entity = await this.repo.findOne({ where: { customerId, isDeleted: false } });
    return entity ? this.toEntity(entity) : null;
  }

  async findAll(page: number, limit: number): Promise<{ data: CustomerEntity[]; total: number }> {
    const [data, total] = await this.repo.findAndCount({
      where: { isDeleted: false },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data: data.map((e) => this.toEntity(e)), total };
  }

  async findOrCreate(
    phone: string,
    fullName?: string,
    email?: string,
  ): Promise<{ customer: CustomerEntity; isNew: boolean }> {
    const result = await this.sp.executeWithOutput<{ CustomerId: string; IsNew: number }>(
      'sp_FindOrCreateCustomer',
      { Phone: phone, FullName: fullName ?? null, Email: email ?? null },
      ['CustomerId', 'IsNew'],
    );
    const customer = await this.findById(result.CustomerId);
    return { customer: customer!, isNew: result.IsNew === 1 };
  }

  async softDelete(customerId: string): Promise<void> {
    await this.sp.execute('sp_SoftDeleteEntity', { EntityType: 'Customer', EntityId: customerId });
  }

  private toEntity(orm: CustomerOrmEntity): CustomerEntity {
    const entity = new CustomerEntity();
    entity.customerId = orm.customerId;
    entity.fullName = orm.fullName;
    entity.phone = orm.phone;
    entity.email = orm.email ?? undefined;
    entity.isDeleted = orm.isDeleted;
    entity.createdAt = orm.createdAt;
    entity.updatedAt = orm.updatedAt;
    return entity;
  }
}
