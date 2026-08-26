import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Lỗi hệ thống. Vui lòng thử lại sau.';
    let errors: string[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, unknown>;
        message = (resObj['message'] as string) ?? message;
        if (Array.isArray(resObj['message'])) {
          errors = resObj['message'] as string[];
          message = 'Dữ liệu không hợp lệ.';
        }
      }
    } else if (exception instanceof Error) {
      // SQL Server SP RAISERROR
      if (
        exception.message.includes('RAISERROR') ||
        exception.message.includes('RAISEERROR')
      ) {
        status = HttpStatus.BAD_REQUEST;
        message = exception.message.split('\n')[0] ?? message;
      } else {
        this.logger.error(
          `Unhandled: ${request.method} ${request.url}`,
          exception.stack,
        );
      }
    }

    // For SSR routes, redirect to login page if unauthenticated, or to login/dashboard
    const acceptsHtml = request.headers['accept']?.includes('text/html');
    if (acceptsHtml && !request.url.startsWith('/api')) {
      if (request.url.startsWith('/login')) {
        response.status(status).render('auth/login', {
          layout: 'layouts/auth',
          title: 'Đăng nhập — Smart TechRepair Hub',
          error: message,
        });
        return;
      }
      response.redirect('/login');
      return;
    }

    response.status(status).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
