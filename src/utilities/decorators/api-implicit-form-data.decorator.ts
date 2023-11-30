import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { createParamDecorator } from '@nestjs/swagger/dist/decorators/helpers';
import { isNil } from 'lodash';
import { Observable } from 'rxjs';

const initialMetadata = {
  name: '',
  required: true,
};

export const ApiImplicitFormData = (metadata: {
  name: string;
  description?: string;
  required?: boolean;
  type: any;
}): MethodDecorator => {
  const param = {
    name: isNil(metadata.name) ? initialMetadata.name : metadata.name,
    in: 'formData',
    description: metadata.description || '',
    required: metadata.required || false,
    type: metadata.type,
  };
  return createParamDecorator(param, initialMetadata);
};

@Injectable()
export class FileToBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    if (req.body && req.file?.fieldname) {
      const { fieldname } = req.file;
      if (!req.body[fieldname]) {
        req.body[fieldname] = req.file;
      }
    }

    return next.handle();
  }
}
