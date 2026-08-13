import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceOrderOrmEntity } from '../infrastructure/database/typeorm/entities/service-order.orm-entity';
import { CustomerOrmEntity } from '../infrastructure/database/typeorm/entities/customer.orm-entity';
import { ServiceOrderRepository } from '../infrastructure/database/repositories/service-order.repository';
import { CustomerRepository } from '../infrastructure/database/repositories/customer.repository';
import { SpCallerService } from '../infrastructure/database/sp-caller.service';
import { SERVICE_ORDER_REPOSITORY } from '../core/interfaces/repositories/service-order.repository.interface';
import { CUSTOMER_REPOSITORY } from '../core/interfaces/repositories/customer.repository.interface';
import { CreateOrderUseCase } from '../application/service-orders/create-order.use-case';
import { UpdateStatusUseCase } from '../application/service-orders/update-status.use-case';
import { GetOrderUseCase } from '../application/service-orders/get-order.use-case';
import { ServiceOrdersController } from '../presentation/api/service-orders.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceOrderOrmEntity, CustomerOrmEntity]),
  ],
  providers: [
    SpCallerService,
    { provide: SERVICE_ORDER_REPOSITORY, useClass: ServiceOrderRepository },
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepository },
    ServiceOrderRepository,
    CustomerRepository,
    CreateOrderUseCase,
    UpdateStatusUseCase,
    GetOrderUseCase,
  ],
  controllers: [ServiceOrdersController],
  exports: [SERVICE_ORDER_REPOSITORY, CUSTOMER_REPOSITORY, SpCallerService],
})
export class ServiceOrdersModule {}
