import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Error';

    // Manejo específico de errores
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as any;
      message = response.message || response;
      error = exception.name;
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      // Errores comunes de TypeORM
      if (
        exception.message.includes(
          'duplicate key value violates unique constraint',
        )
      ) {
        message = `El registro ya existe (clave duplicada)`;
        error = 'UniqueConstraintViolation';
      } else if (
        exception.message.includes('violates foreign key constraint')
      ) {
        message = 'Violación de clave foránea';
        error = 'ForeignKeyConstraintViolation';
      } else if (exception.message.includes('null value in column')) {
        message = 'Valor requerido no puede ser nulo';
        error = 'NotNullConstraintViolation';
      } else {
        message = 'Error en la base de datos';
        error = 'DatabaseError';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : null,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
    });
  }
}
