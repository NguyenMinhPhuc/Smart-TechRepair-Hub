import { CustomerEntity } from '../../domain/entities/customer.entity';

export interface ICustomerRepository {
  findByPhone(phone: string): Promise<CustomerEntity | null>;
  findById(customerId: string): Promise<CustomerEntity | null>;
  findAll(page: number, limit: number): Promise<{ data: CustomerEntity[]; total: number }>;
  findOrCreate(phone: string, fullName?: string, email?: string): Promise<{ customer: CustomerEntity; isNew: boolean }>;
  softDelete(customerId: string): Promise<void>;
}

export const CUSTOMER_REPOSITORY = 'ICustomerRepository';
