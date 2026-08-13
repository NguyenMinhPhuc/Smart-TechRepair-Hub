import { QuoteStatus } from '../enums/quote-status.enum';

export class QuoteEntity {
  quoteId: string;
  orderId: string;
  totalLaborCost: number;
  totalPartsCost: number;
  status: QuoteStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
