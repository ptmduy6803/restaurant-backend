import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class DecimalSerializerInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(map((data) => this.serialize(data)));
  }

  private serialize(value: unknown): unknown {
    if (value === null || value === undefined) return value;

    if (value instanceof Prisma.Decimal ) {
      return value.toNumber();
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.serialize(item));
    }

    if (value instanceof Date || value instanceof RegExp) return value;

    if (typeof value === 'object') {
      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        result[key] = this.serialize(val);
      }
      return result;
    }

    return value;
  }
}