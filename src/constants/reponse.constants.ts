import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';

export const SuccessResponse = (data = '') => ({
    meta: {
      statusCode: HttpStatus.OK,
      message: '',
      error: '',
    },
    result: {
      data: data || null,
    },
  });

  export const BadRequestResponse = {
    meta: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: '',
      error: '',
    },
    result: {
      data: null,
    },
  };