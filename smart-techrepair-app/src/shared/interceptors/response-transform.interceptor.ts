import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface ApiResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T> | T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T> | T> {
    const request = context.switchToHttp().getRequest<Request>();
    // Only wrap API routes, not SSR views
    if (request.url.startsWith('/api')) {
      return next.handle().pipe(
        map((data) => ({
          success: true as const,
          data,
          timestamp: new Date().toISOString(),
        })),
      );
    }
    return next.handle();
  }
}
