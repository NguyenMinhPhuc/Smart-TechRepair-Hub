import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartOrmEntity } from '../infrastructure/database/typeorm/entities/part.orm-entity';
import { CategoryOrmEntity } from '../infrastructure/database/typeorm/entities/category.orm-entity';
import { InventoryRepository } from '../infrastructure/database/repositories/inventory.repository';
import { SpCallerService } from '../infrastructure/database/sp-caller.service';
import { INVENTORY_REPOSITORY } from '../core/interfaces/repositories/inventory.repository.interface';
import { ManageInventoryUseCase } from '../application/inventory/manage-inventory.use-case';
import { InventoryController } from '../presentation/api/inventory.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartOrmEntity, CategoryOrmEntity]),
  ],
  providers: [
    SpCallerService,
    { provide: INVENTORY_REPOSITORY, useClass: InventoryRepository },
    InventoryRepository,
    ManageInventoryUseCase,
  ],
  controllers: [InventoryController],
  exports: [INVENTORY_REPOSITORY, ManageInventoryUseCase],
})
export class InventoryModule {}
