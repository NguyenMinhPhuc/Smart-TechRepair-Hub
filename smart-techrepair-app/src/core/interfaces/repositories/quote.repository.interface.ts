import { QuoteEntity } from '../../domain/entities/quote.entity';

export interface IQuoteRepository {
  createOrUpdate(orderId: string, totalLaborCost: number, notes?: string): Promise<QuoteEntity>;
  addPart(orderId: string, partId: string, quantity: number): Promise<void>;
  approveOrReject(trackingCode: string, phone: string, action: 'Approve' | 'Reject'): Promise<void>;
  findByOrderId(orderId: string): Promise<QuoteEntity | null>;
}

export const QUOTE_REPOSITORY = 'IQuoteRepository';
