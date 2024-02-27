import { HttpStatus } from '@nestjs/common';

export const SuccessResponse = (data: any = null) => ({
  data: data || null,
  statusCode: HttpStatus.OK,
});

export const SigninResponse = (
  accessToken: any = null,
  refreshToken: any = null,
) => ({
  accessToken: accessToken || null,
  refreshToken: refreshToken || null,
});

export const BadRequestResponse = (message: string = null) => ({
  message: message,
  statusCode: HttpStatus.BAD_REQUEST,
});

export const NotFoundResponse = (message: string = '') => ({
  message: message,
  statusCode: HttpStatus.NOT_FOUND,
});

export const UnauthorizedResponse = () => ({
  message: '',
  statusCode: HttpStatus.UNAUTHORIZED,
});

export const InternalServerErrorReponse = () => ({
  message: 'Internal Server Error',
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
});
