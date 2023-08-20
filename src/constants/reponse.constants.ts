import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';

export const SuccessResponse = (data: any = null) => ({
  message: '',
  data: data || null,
  statusCode: HttpStatus.OK,
});

export const SigninResponse = (token: any = null, data: any = null) => ({
  accessToken: token || null,
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