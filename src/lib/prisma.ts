import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const findInvoiceById = async (id: number) => {
  return await prisma.invoice.findUnique({
    where: {
      id,
    },
  });
};

export const getInvoices = async (page: number = 1, limit: number = 10) => {
  const startOffset = (page - 1) * limit;
  const endOffset = page * limit;
  let next: { page?: number; limit?: number } | null = null;
  let prev: { page?: number; limit?: number } | null = null;

  const [invoices, count] = await prisma.$transaction([
    prisma.invoice.findMany({
      take: limit,
      skip: startOffset,
      orderBy: {
        id: 'desc',
      },
    }),

    prisma.invoice.count(),
  ]);

  if (endOffset < count) {
    next = {
      page: page + 1,
      limit,
    };
  }

  if (startOffset > 0) {
    prev = {
      page: page - 1,
      limit,
    };
  }

  return {
    invoices,
    count,
    next,
    prev,
  };
};
