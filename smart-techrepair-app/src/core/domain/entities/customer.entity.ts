export class CustomerEntity {
  customerId: string;
  fullName: string;
  phone: string;
  email?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
