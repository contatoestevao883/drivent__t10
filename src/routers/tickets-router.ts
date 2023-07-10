import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTicketTypes, getTickets } from '@/controllers/tickets-controller';

const ticketsRouter = Router();
ticketsRouter.all('/*', authenticateToken);
ticketsRouter.get('/types', getTicketTypes);
ticketsRouter.get('/', getTickets);
ticketsRouter.post('/', getTickets);

export { ticketsRouter };
