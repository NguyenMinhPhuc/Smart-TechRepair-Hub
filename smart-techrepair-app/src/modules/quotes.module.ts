import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteOrmEntity } from '../infrastructure/database/typeorm/entities/quote.orm-entity';
import { ServiceOrderOrmEntity } from '../infrastructure/database/typeorm/entities/service-order.orm-entity';
import { QuoteRepository } from '../infrastructure/database/repositories/quote.repository';
import { ServiceOrderRepository } from '../infrastructure/database/repositories/service-order.repository';
import { CustomerOrmEntity } from '../infrastructure/database/typeorm/entities/customer.orm-entity';
import { CustomerRepository } from '../infrastructure/database/repositories/customer.repository';
import { SpCallerService } from '../infrastructure/database/sp-caller.service';
import { QUOTE_REPOSITORY } from '../core/interfaces/repositories/quote.repository.interface';
import { SERVICE_ORDER_REPOSITORY } from '../core/interfaces/repositories/service-order.repository.interface';
import { CUSTOMER_REPOSITORY } from '../core/interfaces/repositories/customer.repository.interface';
import { CreateQuoteUseCase } from '../application/quotes/create-quote.use-case';
import { ApproveQuoteUseCase } from '../application/quotes/approve-quote.use-case';
import { QuotesController } from '../presentation/api/quotes.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuoteOrmEntity, ServiceOrderOrmEntity, CustomerOrmEntity]),
  ],
  providers: [
    SpCallerService,
    { provide: QUOTE_REPOSITORY, useClass: QuoteRepository },
    { provide: SERVICE_ORDER_REPOSITORY, useClass: ServiceOrderRepository },
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepository },
    QuoteRepository,
    ServiceOrderRepository,
    CustomerRepository,
    CreateQuoteUseCase,
    ApproveQuoteUseCase,
  ],
  controllers: [QuotesController],
})
export class QuotesModule {}
