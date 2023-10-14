import { HttpStatus } from '@nestjs/common';

export const SuccessResponse = (data: any = null) => ({
  data: data || null,
  statusCode: HttpStatus.OK,
});

export const SigninResponse = (
  accessToken: any = null,
  refreshToken: any = null,
  data: any = null,
) => ({
  accessToken: accessToken || null,
  refreshToken: refreshToken || null,
  data: data || null,
  statusCode: HttpStatus.OK,
});

export const BadRequestResponse = () => ({
  message: '',
  statusCode: HttpStatus.BAD_REQUEST,
});

export const NotFoundResponse = () => ({
  message: '',
  statusCode: HttpStatus.NOT_FOUND,
});

export const UnauthorizedResponse = () => ({
  message: '',
  statusCode: HttpStatus.UNAUTHORIZED,
});
