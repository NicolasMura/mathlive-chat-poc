import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);

    console.log(exception);
  }
}

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

//   catch(exception: unknown, host: ArgumentsHost): void {
//     // In certain situations `httpAdapter` might not be available in the
//     // constructor method, thus we should resolve it here.
//     const { httpAdapter } = this.httpAdapterHost;

//     const ctx = host.switchToHttp();

//     const httpStatus =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;

//     const responseBody = {
//       statusCode: httpStatus,
//       timestamp: new Date().toISOString(),
//       path: httpAdapter.getRequestUrl(ctx.getRequest()),
//     };

//     httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
//   }
// }
