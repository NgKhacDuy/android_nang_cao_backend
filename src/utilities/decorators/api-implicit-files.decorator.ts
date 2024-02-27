import { createParamDecorator } from '@nestjs/swagger/dist/decorators/helpers';
import { isNil } from 'lodash';

const initialMetadata = {
  name: '',
  required: true,
};

export const ApiImplicitFiles = (metadata: {
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

  // Check if the type is an array, and if so, create a schema for files
  if (metadata.type === Array) {
    param['type'] = 'array';
    param['items'] = { type: 'string', format: 'binary' };
  }

  return createParamDecorator(param, initialMetadata);
};
