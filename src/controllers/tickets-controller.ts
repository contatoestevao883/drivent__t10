import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketService from '@/services/tickets-service.ts';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const result = await ticketService.getTicketTypes();
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.OK).send([]);
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const result = await ticketService.getTickets(userId);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;

  try {
    await ticketService.postTickets(ticketTypeId, userId);
    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === 'Bad Request') {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}
