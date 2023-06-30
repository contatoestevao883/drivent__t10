import { ApplicationError, ApplicationErrorBadRequest } from '@/protocols';

export function notFoundError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'No result for this search!',
  };
}

export function badRequestError(): ApplicationErrorBadRequest {
  return {
    name: 'Bad Request',
    message: `"erro": "true"`,
  };
}
