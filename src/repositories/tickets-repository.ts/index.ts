import { prisma } from '@/config';

async function findTicketTypes() {
  const types = await prisma.ticketType.findMany();
  return types;
}

async function getTicketByEnrollmentId(userId: number) {
  const user = await prisma.enrollment.findFirst({
    where: { id: userId },
  });
  return user;
}

async function getTicketById(ticketId: number) {
  const ticket = await prisma.ticket.findFirst({
    where: { id: ticketId },
    include: { TicketType: true },
  });
  return ticket;
}

async function postTickets(ticketId: number, userId: number) {
  await prisma.ticket.create({
    data: {
      status: 'RESERVED',
      ticketTypeId: ticketId,
      enrollmentId: userId,
    },
  });
}

const ticketRepository = {
  findTicketTypes,
  getTicketByEnrollmentId,
  getTicketById,
  postTickets,
};

export default ticketRepository;
