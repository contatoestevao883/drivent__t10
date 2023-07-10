import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTicketTypes, getTickets, postTickets } from '@/controllers/tickets-controller';

const ticketsRouter = Router();
ticketsRouter.all('/*', authenticateToken);
ticketsRouter.get('/types', getTicketTypes);
ticketsRouter.get('/', getTickets);
ticketsRouter.post('/', postTickets);

export { ticketsRouter };
