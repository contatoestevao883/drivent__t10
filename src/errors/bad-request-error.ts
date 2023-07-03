import { ApplicationError } from '@/protocols';

export function badRequestError(): ApplicationError {
  return {
    name: 'Bad Request',
    message: '400 Bad Request',
  };
}
