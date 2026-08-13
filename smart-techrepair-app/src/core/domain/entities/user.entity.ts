import { Role } from '../enums/role.enum';

export class UserEntity {
  userId: string;
  username: string;
  email: string;
  passwordHash: string;
  role: Role;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
