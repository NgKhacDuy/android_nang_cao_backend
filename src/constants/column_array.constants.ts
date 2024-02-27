import { Column, ColumnOptions, ValueTransformer } from 'typeorm';

export const RoleArrayType = (options?: ColumnOptions): PropertyDecorator => {
  const defaultOptions: ColumnOptions = {
    type: 'varchar',
    transformer: {
      from: (dbValue: string) => dbValue.split(','),
      to: (entityValue: string[]) => entityValue.join(','),
    },
  };

  const mergedOptions = Object.assign(defaultOptions, options);

  return Column(mergedOptions);
};
