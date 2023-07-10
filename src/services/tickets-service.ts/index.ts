import ticketRepository from '@/repositories/tickets-repository.ts';
import { notFoundError } from '@/errors';
import { badRequestError } from '@/errors/bad-request-error';

async function getTicketTypes() {
  const ticketTypes = await ticketRepository.findTicketTypes();

  return ticketTypes;
}

async function getTickets(id: number) {
  const user = await ticketRepository.getTicketByEnrollmentId(id);

  if (!user) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.getTicketById(id);

  if (!ticket) {
    throw notFoundError();
  }

  return ticket;
}

async function postTickets(ticketId: number, userId: number) {
  if (!userId) {
    throw notFoundError();
  }

  if (!ticketId) {
    throw badRequestError();
  }

  const tickets = await ticketRepository.postTickets(ticketId, userId);

  return tickets;
}

const ticketService = {
  getTicketTypes,
  getTickets,
  postTickets,
};

export default ticketService;
