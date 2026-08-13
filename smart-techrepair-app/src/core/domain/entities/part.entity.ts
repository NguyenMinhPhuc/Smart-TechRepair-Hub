import { PartStatus } from '../enums/part-status.enum';

export class PartEntity {
  partId: string;
  categoryId: string;
  name: string;
  serialIMEI: string;
  status: PartStatus;
  price: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
